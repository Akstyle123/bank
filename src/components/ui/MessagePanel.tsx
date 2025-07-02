import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  Paperclip, 
  Image, 
  File,
  Search,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreVertical
} from 'lucide-react';
import { useMessages } from '../../context/MessageContext';

interface MessagePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MessagePanel({ isOpen, onClose }: MessagePanelProps) {
  const { messages, unreadCount, markMessagesSeen, refreshMessages, sendMessage } = useMessages();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState({
    subject: '',
    message: '',
    priority: 'Normal' as 'Low' | 'Normal' | 'High'
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    if (isOpen) {
      refreshMessages();
    }
  }, [isOpen, refreshMessages]);

  const handleMarkAllRead = () => {
    markMessagesSeen();
  };

  const handleSendMessage = async () => {
    if (!newMessage.subject.trim() || !newMessage.message.trim()) return;

    const success = await sendMessage({
      subject: newMessage.subject,
      message: newMessage.message,
      priority: newMessage.priority,
      attachments: attachments
    });

    if (success) {
      setNewMessage({ subject: '', message: '', priority: 'Normal' });
      setAttachments([]);
      setShowCompose(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 dark:text-red-400';
      case 'Normal':
        return 'text-blue-600 dark:text-blue-400';
      case 'Low':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-25" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-gray-900 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Messages
              </h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCompose(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                Compose
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Messages List or Compose */}
          <div className="flex-1 overflow-hidden">
            {showCompose ? (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Compose Message</h3>
                    <button
                      onClick={() => setShowCompose(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={newMessage.subject}
                        onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Enter subject..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Priority
                      </label>
                      <select
                        value={newMessage.priority}
                        onChange={(e) => setNewMessage(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="Low">Low</option>
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4">
                  <textarea
                    value={newMessage.message}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full h-full resize-none border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3"
                    placeholder="Type your message..."
                  />
                </div>

                {/* Attachments */}
                {attachments.length > 0 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <File className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                          </div>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compose Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <label className="cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <Paperclip className="h-5 w-5" />
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <label className="cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <Image className="h-5 w-5" />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.subject.trim() || !newMessage.message.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedMessage ? (
              <div className="h-full flex flex-col">
                {/* Message Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                    >
                      ← Back to messages
                    </button>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Star className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Archive className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedMessage.subject}</h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>From: {selectedMessage.sender}</span>
                    <span>{new Date(selectedMessage.timestamp).toLocaleString()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority}
                    </span>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                  
                  {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Attachments</h4>
                      <div className="space-y-2">
                        {selectedMessage.attachments.map((attachment: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <File className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{attachment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Actions */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                      <Reply className="h-4 w-4" />
                      <span>Reply</span>
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                      <Forward className="h-4 w-4" />
                      <span>Forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-y-auto">
                {filteredMessages.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.messageId}
                        onClick={() => setSelectedMessage(message)}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                          !message.seen ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className={`text-sm font-medium ${
                                !message.seen 
                                  ? 'text-gray-900 dark:text-white' 
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {message.sender}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(message.priority)}`}>
                                {message.priority}
                              </span>
                            </div>
                            <p className={`text-sm ${
                              !message.seen 
                                ? 'font-medium text-gray-900 dark:text-white' 
                                : 'text-gray-600 dark:text-gray-400'
                            } truncate`}>
                              {message.subject}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                              {message.message}
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(message.timestamp).toLocaleDateString()}
                            </p>
                            {!message.seen && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <MessageSquare className="h-12 w-12 mb-4" />
                    <p className="text-lg font-medium">No messages</p>
                    <p className="text-sm">Your inbox is empty</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}