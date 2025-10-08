"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, GraduationCapIcon } from "lucide-react";
import { sendMessage } from "@/services/stream";

interface Message {
  role: "user" | "assistant";
  content: string;
}
const Chatbot: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    adjustTextareaHeight();
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const currentMessage = userInput.trim();
    setUserInput("");
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: currentMessage,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Add empty assistant message that will be updated
    const assistantMessage: Message = {
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      // Create conversation history including the new user message
      const conversationHistory = [...messages, userMessage];

      await sendMessage(
        conversationHistory,
        (data: string) => {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role === "assistant") {
              if (!lastMessage.content.endsWith(data)) {
                lastMessage.content += data;
              }
            }
            return newMessages;
          });
        },
        () => {
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === "assistant") {
          lastMessage.content =
            "Sorry, I encountered an error. Please try again.";
        }
        return newMessages;
      });
      setIsLoading(false);
    }

    setTimeout(() => textareaRef.current?.focus(), 10);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="h-dvh flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 w-full overflow-y-auto scrollbar space-y-4">
          <div className="max-w-3xl mx-auto pt-20 px-4 pb-4 space-y-2">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground mt-8">
                <GraduationCapIcon className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Welcome to Ask Juree</p>
                <p>Your Leagal AI Assistant!</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex ${
                    message.role === "user"
                      ? "flex-row-reverse max-w-[85%]"
                      : "flex-row"
                  } items-start space-x-2`}
                >
                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-popover text-popover-foreground"
                        : ""
                    }`}
                  >
                    <div className="break-words">
                      {message.role === "user" ? (
                        <div className="whitespace-pre-wrap">
                          {message.content}
                        </div>
                      ) : (
                        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-pre:my-2 prose-code:text-sm prose-headings:my-2">
                          {message.content}
                        </div>
                      )}
                      {message.role === "assistant" &&
                        isLoading &&
                        index === messages.length - 1 && (
                          <div className="p-2 flex space-x-1">
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Bottom Area */}
        <div className="w-full">
          <div className="max-w-3xl mx-auto">
            {/* Input Area */}
            <div className="flex items-end bg-popover text-popover-foreground rounded-[1.5rem] border shadow-md">
              <div className="flex-1 flex relative">
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  placeholder="Ask anything"
                  className="w-full px-6 py-3 resize-none outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={1}
                  style={{ minHeight: "48px", maxHeight: "120px" }}
                />
              </div>

              <button
                onClick={handleSendMessage}
                disabled={isLoading || !userInput.trim()}
                className="p-2 m-1.5 flex-shrink-0 rounded-full bg-foreground text-background cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>

            <p className="text-xs text-muted-foreground my-2 text-center">
              Ask Juree can make mistakes. Check inportant info.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
