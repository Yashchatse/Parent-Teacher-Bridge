"use client";

import React, { useEffect, useState } from 'react';
import {
  PaperAirplaneIcon,
  UserCircleIcon,
  FaceSmileIcon,
} from '@heroicons/react/24/solid';
import EmojiPicker from 'emoji-picker-react';
import { parentService } from '../../services/parentService';
import { useParentAuth } from '../../context/ParentAuthContext';

function Messages() {
  const { parent } = useParentAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const defaultTeacherId = 1;

  useEffect(() => {
    const abort = new AbortController();
    const run = async () => {
      try {
        const parentId = parent?.parentId || parent?.id || 1;
        const inbox = await parentService.getMessages(parentId);
        if (!abort.signal.aborted) setMessages(inbox || []);
      } catch (e) {
        if (!abort.signal.aborted) setMessages([]);
      }
    };
    run();
    return () => abort.abort();
  }, [parent]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const optimistic = {
      id: `tmp-${Date.now()}`,
      senderRole: 'parent',
      senderId: parent?.parentId || parent?.id || 1,
      receiverRole: 'teacher',
      receiverId: defaultTeacherId,
      messageContext: newMessage,
      sentAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setNewMessage('');
    try {
      const saved = await parentService.sendMessage(
        parent?.parentId || parent?.id || 1,
        {
          receiverId: defaultTeacherId,
          message: optimistic.messageContext
        }
      );
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? saved : m)));
    } catch (e) {
      console.error('Failed to send message:', e);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white rounded-2xl shadow-2xl flex flex-col h-[80vh] relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-5 rounded-t-2xl shadow-md">
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-sm text-indigo-100">Parent ↔ Teacher Communication</p>
      </div>

      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>No messages yet. Start a conversation with your child's teacher!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isParent = (msg.sender_role || msg.senderRole) === 'parent';
            return (
              <div
                key={msg.message_id || msg.id}
                className={`flex items-start gap-3 ${
                  isParent ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isParent && <UserCircleIcon className="h-8 w-8 text-green-500" />}
                <div
                  className={`max-w-[70%] p-4 rounded-xl shadow-md ${
                    isParent ? 'bg-indigo-100 text-right' : 'bg-green-100 text-left'
                  }`}
                >
                  <p className="text-base text-gray-800">{msg.message || msg.messageContext}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.sent_at || msg.sentAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {isParent && <UserCircleIcon className="h-8 w-8 text-indigo-500" />}
              </div>
            );
          })
        )}
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-8 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="light" />
        </div>
      )}

      {/* Message Input */}
      <div className="border-t px-8 py-5 flex items-center gap-4 bg-white rounded-b-2xl">
        {/* Emoji Button */}
        <button
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="text-yellow-500 hover:text-yellow-600"
        >
          <FaceSmileIcon className="h-6 w-6" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className="bg-indigo-500 text-white p-3 rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default Messages;
