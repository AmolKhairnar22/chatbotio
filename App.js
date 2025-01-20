import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [senderFilter, setSenderFilter] = useState('');
  const [keywordFilter, setKeywordFilter] = useState('');

  // Fetch Messages from Backend
  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-messages', {
        params: {
          sender: senderFilter,
          keyword: keywordFilter,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send a New Message
  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      sender: 'user', // Default sender
      message: inputText,
    };

    try {
      await axios.post('http://localhost:5000/send-message', newMessage);
      setInputText(''); // Clear input field
      fetchMessages(); // Refresh messages after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Fetch Messages on Mount or Filter Change
  useEffect(() => {
    fetchMessages();
  }, [senderFilter, keywordFilter]);

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="filters">
          <input
            type="text"
            placeholder="Filter by sender"
            value={senderFilter}
            onChange={(e) => setSenderFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by keyword"
            value={keywordFilter}
            onChange={(e) => setKeywordFilter(e.target.value)}
          />
          <button onClick={fetchMessages}>Apply Filters</button>
        </div>
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender === 'user' ? 'user-message' : 'chatbot-message'}`}>
              <p>{message.message}</p>
              <span>{new Date(message.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="input-field"
          />
          <button className="send-button" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
