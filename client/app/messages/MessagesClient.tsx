'use client';

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { sendMessage, type InstanceWithData, type MessageData } from "./actions";

function getDisplayName(user: InstanceWithData["otherUser"]) {
  return user.gamerTag || user.name || user.email;
}

function getInitials(user: InstanceWithData["otherUser"]) {
  const name = getDisplayName(user);
  return name.slice(0, 2).toUpperCase();
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

type Props = {
  instances: InstanceWithData[];
  currentUserId: number;
};

export default function MessagesClient({ instances, currentUserId }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(
    instances[0]?.id ?? null
  );
  const [localInstances, setLocalInstances] = useState<InstanceWithData[]>(instances);
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const selectedInstance = localInstances.find((i) => i.id === selectedId) ?? null;

  const prevSelectedIdRef = useRef<number | null>(null);

  useEffect(() => {
    const switchedConversation = prevSelectedIdRef.current !== selectedId;
    prevSelectedIdRef.current = selectedId;
    if (switchedConversation) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedInstance?.messages.length, selectedId]);

  function handleSelect(id: number) {
    setSelectedId(id);
    setInputValue("");
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || !selectedId) return;

    // Optimistic update
    const optimisticMsg: MessageData = {
      id: 0,
      content: trimmed,
      //sentAt: new Date(),
      senderId: currentUserId,
      recipientId: selectedInstance!.otherUser.id,
      //isRead: false,
      instanceId: selectedId,
      createdAt: new Date()
    };

    setLocalInstances((prev) =>
      prev.map((inst) =>
        inst.id === selectedId
          ? { ...inst, messages: [...inst.messages, optimisticMsg] }
          : inst
      )
    );
    setInputValue("");

    startTransition(async () => {
      const result = await sendMessage(selectedId, trimmed);
      if (result.error) {
        // Rollback on error
        setLocalInstances((prev) =>
          prev.map((inst) =>
            inst.id === selectedId
              ? {
                  ...inst,
                  messages: inst.messages.filter((m) => m.id !== optimisticMsg.id),
                }
              : inst
          )
        );
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)", overflow: "hidden" }}>
      {/* Left Panel */}
      <div
        style={{
          width: "320px",
          minWidth: "320px",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
        }}
      >
        <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb" }}>
          <h5 style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem" }}>Messages</h5>
        </div>

        <div style={{ overflowY: "auto", flex: 1 }}>
          {localInstances.length === 0 ? (
            <p className="text-muted p-3">No conversations yet.</p>
          ) : (
            localInstances.map((inst) => {
              const lastMsg = inst.messages[inst.messages.length - 1];
              const unread = inst.messages.filter(
                (m) => m.senderId !== currentUserId
              ).length;
              const isSelected = inst.id === selectedId;

              return (
                <button
                  key={inst.id}
                  onClick={() => handleSelect(inst.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    border: "none",
                    borderLeft: isSelected ? "3px solid #7c3aed" : "3px solid transparent",
                    background: isSelected ? "#f5f3ff" : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {inst.otherUser.avatarUrl ? (
                      <img
                        src={inst.otherUser.avatarUrl}
                        alt={getDisplayName(inst.otherUser)}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      getInitials(inst.otherUser)
                    )}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#111" }}>
                        {getDisplayName(inst.otherUser)}
                      </span>
                      {lastMsg && (
                        <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                          {formatTime(lastMsg.createdAt)}
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "160px",
                        }}
                      >
                        {lastMsg
                          ? `${lastMsg.senderId === currentUserId ? "You: " : ""}${lastMsg.content}`
                          : "No messages yet"}
                      </span>
                      {unread > 0 && (
                        <span
                          style={{
                            background: "#7c3aed",
                            color: "#fff",
                            borderRadius: "999px",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            padding: "1px 7px",
                            flexShrink: 0,
                          }}
                        >
                          {unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Panel */}
      {selectedInstance ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f9fafb" }}>
          {/* Chat Header */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid #e5e7eb",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.85rem",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {selectedInstance.otherUser.avatarUrl ? (
                <img
                  src={selectedInstance.otherUser.avatarUrl}
                  alt={getDisplayName(selectedInstance.otherUser)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                getInitials(selectedInstance.otherUser)
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111" }}>
                {getDisplayName(selectedInstance.otherUser)}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                {selectedInstance.otherUser.email}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {selectedInstance.messages.length === 0 ? (
              <p style={{ color: "#9ca3af", textAlign: "center", marginTop: "40px" }}>
                No messages yet. Say hello!
              </p>
            ) : (
              selectedInstance.messages.map((msg) => {
                const isMine = msg.senderId === currentUserId;
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isMine ? "flex-end" : "flex-start",
                    }}
                  >
                    {!isMine && (
                      <span style={{ fontSize: "0.72rem", color: "#9ca3af", marginBottom: "2px", marginLeft: "4px" }}>
                        {getDisplayName(selectedInstance.otherUser)}, {formatTime(msg.createdAt)}
                      </span>
                    )}
                    <div
                      style={{
                        maxWidth: "65%",
                        padding: "10px 14px",
                        borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        background: isMine ? "linear-gradient(135deg, #7c3aed, #a78bfa)" : "#fff",
                        color: isMine ? "#fff" : "#111",
                        fontSize: "0.88rem",
                        lineHeight: 1.5,
                        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.content}
                    </div>
                    {isMine && (
                      <span style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "2px", marginRight: "4px" }}>
                        {formatTime(msg.createdAt)}
                      </span>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            style={{
              padding: "14px 20px",
              borderTop: "1px solid #e5e7eb",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Write a message..."
              disabled={isPending}
              style={{
                flex: 1,
                border: "1px solid #e5e7eb",
                borderRadius: "24px",
                padding: "10px 18px",
                fontSize: "0.88rem",
                outline: "none",
                background: "#f9fafb",
                color: "#111",
              }}
            />
            <button
              type="submit"
              disabled={isPending || !inputValue.trim()}
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                border: "none",
                borderRadius: "50%",
                width: 42,
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                opacity: isPending || !inputValue.trim() ? 0.5 : 1,
                transition: "opacity 0.15s",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9ca3af",
            fontSize: "0.95rem",
          }}
        >
          Select a conversation to start chatting
        </div>
      )}
    </div>
  );
}
