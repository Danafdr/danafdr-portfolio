'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from '@/components/admin/Toast';

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await apiFetch('/api/admin/messages');
      if (data) {
        setMessages(data);
      }
    } catch (e) {
      toast('Failed to fetch messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    setMessages(msgs => msgs.map(m => String(m.id) === String(id) ? { ...m, is_read: true } : m));
    try {
      await apiFetch(`/api/admin/messages/${id}/read`, { method: 'PATCH' });
    } catch {
      toast('Failed to mark as read', 'error');
      fetchMessages();
    }
  };

  const deleteMessage = async (id: number) => {
    setConfirmDeleteId(null);
    setMessages(msgs => msgs.filter(m => String(m.id) !== String(id)));
    try {
      await apiFetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      toast('Message deleted', 'success');
    } catch {
      toast('Failed to delete message', 'error');
      fetchMessages();
    }
  };

  const handleReply = async (id: number) => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      await apiFetch(`/api/admin/messages/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText }),
      });
      toast('Reply sent successfully', 'success');
      setReplyingTo(null);
      setReplyText('');
      // Mark as read after replying
      setMessages(msgs => msgs.map(m => String(m.id) === String(id) ? { ...m, is_read: true } : m));
    } catch (e: any) {
      toast(e.message || 'Failed to send reply', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) return <div className="p-12 text-[11px] uppercase tracking-widest text-admin-ink3 animate-pulse">Loading messages...</div>;

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="font-playfair text-3xl mb-2 text-admin-ink">Messages</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-admin-ink2">Contact form submissions</p>
      </div>

      {messages.length === 0 ? (
        <div className="border border-dashed border-border p-12 text-center text-[10px] text-admin-ink3 uppercase">
          No messages yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {messages.map(msg => (
            <div key={msg.id} className={`border border-border p-6 bg-paper relative flex flex-col gap-4 ${msg.is_read ? 'opacity-70' : 'border-l-4 border-l-accent'}`}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col">
                  <h3 className="font-bold text-admin-ink text-lg">{msg.name}</h3>
                  <a href={`mailto:${msg.email}`} className="text-[10px] text-accent hover:underline uppercase tracking-wider">{msg.email}</a>
                  <span className="text-[9px] text-admin-ink3 mt-1">{new Date(msg.created_at).toLocaleString()}</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => { setReplyingTo(replyingTo === msg.id ? null : msg.id); setReplyText(''); }} 
                    className="text-[9px] uppercase tracking-wider text-accent hover:underline"
                  >
                    {replyingTo === msg.id ? 'Cancel' : 'Reply'}
                  </button>
                  {!msg.is_read && (
                    <button onClick={() => markAsRead(msg.id)} className="text-[9px] uppercase tracking-wider text-admin-ink hover:text-accent">
                      Mark Read
                    </button>
                  )}
                  {confirmDeleteId === msg.id ? (
                    <div className="flex gap-2 items-center">
                      <span className="text-[9px] text-admin-ink3 uppercase">Sure?</span>
                      <button onClick={() => deleteMessage(msg.id)} className="text-[9px] uppercase tracking-wider text-red-500 font-bold hover:underline">
                        Yes
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)} className="text-[9px] uppercase tracking-wider text-admin-ink hover:underline">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDeleteId(msg.id)} className="text-[9px] uppercase tracking-wider text-red-500 hover:underline">
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <div className="bg-bg p-4 border border-border text-sm whitespace-pre-wrap font-sans text-admin-ink">
                {msg.message}
              </div>
              
              {/* Reply Section */}
              {replyingTo === msg.id && (
                <div className="flex flex-col gap-3 border-t border-border pt-4">
                  <div className="text-[9px] uppercase tracking-[0.15em] text-admin-ink2 font-mono">
                    Reply to {msg.name} ({msg.email})
                  </div>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows={4}
                    className="w-full bg-bg text-admin-ink border border-border px-4 py-3 font-mono text-[12px] focus:border-accent focus:outline-none resize-none"
                  />
                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => handleReply(msg.id)}
                      disabled={sendingReply || !replyText.trim()}
                      className="bg-accent text-paper px-5 py-2 font-mono text-[10px] uppercase tracking-[0.1em] hover:opacity-85 transition-opacity disabled:opacity-50"
                    >
                      {sendingReply ? 'Sending...' : 'Send Reply →'}
                    </button>
                    <span className="text-[9px] text-admin-ink3 font-mono">Email will be sent via SMTP</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
