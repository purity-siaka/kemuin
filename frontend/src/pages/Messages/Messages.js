import React, { useState, useEffect } from 'react';
import { messageService } from '../../services/api';
import '../../styles/Messages.css';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await messageService.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoading(true);
      const response = await messageService.getConversationMessages(conversationId);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await messageService.sendMessage(
        selectedConversation._id,
        { content: newMessage }
      );
      setMessages([...messages, response.data.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="messages-container">
      <div className="conversations-sidebar">
        <h2>Messages</h2>
        <div className="conversations-list">
          {conversations.map((conv) => (
            <div
              key={conv._id}
              className={`conversation-item ${selectedConversation?._id === conv._id ? 'active' : ''}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <h4>{conv.isGroupConversation ? conv.groupName : 
                conv.participants[0]?.firstName} {!conv.isGroupConversation && conv.participants[0]?.lastName}</h4>
              <p className="last-message">{conv.lastMessage?.content?.substring(0, 50)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-area">
        {selectedConversation ? (
          <>
            <div className="chat-header">
              <h3>{selectedConversation.isGroupConversation ? selectedConversation.groupName : 
                selectedConversation.participants[0]?.firstName}</h3>
            </div>
            <div className="messages-list">
              {messages.map((msg) => (
                <div key={msg._id} className="message">
                  <img src={msg.sender.profilePhoto} alt={msg.sender.firstName} />
                  <div className="message-content">
                    <strong>{msg.sender.firstName} {msg.sender.lastName}</strong>
                    <p>{msg.content}</p>
                    <span className="time">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="message-composer">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="no-conversation">Select a conversation to start messaging</div>
        )}
      </div>
    </div>
  );
};

export default Messages;
