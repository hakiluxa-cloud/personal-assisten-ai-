'use client';

import { useState } from 'react';

// Fungsi ChatBox mengelola UI chat, state pesan, input pengguna, loading, dan error di sisi client.
export default function ChatBox() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! Saya personal AI chat assistant kamu. Ada yang bisa saya bantu?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fungsi sendMessage mengirim history percakapan ke API route dan menambahkan balasan AI ke state.
  async function sendMessage(event) {
    event.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const nextMessages = [...messages, { role: 'user', content: trimmedInput }];

    setMessages(nextMessages);
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Gagal mendapatkan respons dari AI.');
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'assistant', content: data.text },
      ]);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengirim pesan.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="chatShell">
      <div className="chatCard">
        <header className="chatHeader">
          <div>
            <p className="eyebrow">Personal AI</p>
            <h1>Chat Assistant</h1>
          </div>
          <span className="status">Online</span>
        </header>

        <div className="messageList" aria-live="polite">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`messageRow ${message.role === 'user' ? 'userRow' : 'assistantRow'}`}
            >
              <div className="messageBubble">
                <span className="messageRole">
                  {message.role === 'user' ? 'Kamu' : 'Assistant'}
                </span>
                <p>{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="messageRow assistantRow">
              <div className="messageBubble loadingBubble">
                <span className="messageRole">Assistant</span>
                <p>Sedang mengetik...</p>
              </div>
            </div>
          )}
        </div>

        {error && <div className="errorBox">{error}</div>}

        <form className="chatForm" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Tulis pesan..."
            aria-label="Tulis pesan"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? 'Mengirim...' : 'Kirim'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .chatShell {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            radial-gradient(circle at top left, rgba(59, 130, 246, 0.24), transparent 32rem),
            radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.2), transparent 28rem),
            #09090b;
        }

        .chatCard {
          width: min(100%, 820px);
          height: min(86vh, 760px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          background: rgba(24, 24, 27, 0.84);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
          backdrop-filter: blur(18px);
        }

        .chatHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .eyebrow {
          margin: 0 0 6px;
          color: #93c5fd;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          font-size: clamp(1.4rem, 4vw, 2rem);
          line-height: 1.1;
        }

        .status {
          flex: 0 0 auto;
          border: 1px solid rgba(34, 197, 94, 0.32);
          border-radius: 999px;
          padding: 8px 12px;
          color: #86efac;
          background: rgba(34, 197, 94, 0.12);
          font-size: 0.85rem;
          font-weight: 700;
        }

        .messageList {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow-y: auto;
          padding: 24px;
        }

        .messageRow {
          display: flex;
        }

        .userRow {
          justify-content: flex-end;
        }

        .assistantRow {
          justify-content: flex-start;
        }

        .messageBubble {
          max-width: min(76%, 560px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 14px 16px;
          background: rgba(39, 39, 42, 0.9);
          color: #f4f4f5;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .userRow .messageBubble {
          border-color: rgba(96, 165, 250, 0.38);
          background: linear-gradient(135deg, #2563eb, #7c3aed);
        }

        .messageRole {
          display: block;
          margin-bottom: 6px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.76rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .messageBubble p {
          margin: 0;
          line-height: 1.6;
        }

        .loadingBubble p {
          color: #d4d4d8;
        }

        .errorBox {
          margin: 0 24px 14px;
          border: 1px solid rgba(248, 113, 113, 0.32);
          border-radius: 14px;
          padding: 12px 14px;
          color: #fecaca;
          background: rgba(127, 29, 29, 0.32);
        }

        .chatForm {
          display: flex;
          gap: 12px;
          padding: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(9, 9, 11, 0.58);
        }

        input {
          flex: 1;
          min-width: 0;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          outline: none;
          padding: 14px 16px;
          color: #f4f4f5;
          background: rgba(39, 39, 42, 0.9);
        }

        input:focus {
          border-color: rgba(96, 165, 250, 0.78);
          box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.16);
        }

        input:disabled {
          opacity: 0.7;
        }

        button {
          border: 0;
          border-radius: 16px;
          padding: 0 20px;
          color: white;
          background: #2563eb;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.15s ease, opacity 0.15s ease, background 0.15s ease;
        }

        button:hover:not(:disabled) {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }

        @media (max-width: 640px) {
          .chatShell {
            padding: 0;
          }

          .chatCard {
            height: 100vh;
            border-radius: 0;
            border-left: 0;
            border-right: 0;
          }

          .chatHeader,
          .messageList {
            padding: 18px;
          }

          .messageBubble {
            max-width: 88%;
          }

          .chatForm {
            flex-direction: column;
          }

          button {
            min-height: 48px;
          }
        }
      `}</style>
    </section>
  );
}
