/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, ChevronRight, ChevronLeft, Bot, Phone, Trash2 } from "lucide-react"; // Added Trash2
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ZeniaChat() {
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isTextVisible, setIsTextVisible] = useState(true); // Collapsible text state
    const [mode, setMode] = useState<"initial" | "language" | "chat">("initial");
    const [chatLang, setChatLang] = useState<"en" | "ar">("en");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isRTL = language === 'ar';

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Reset Chat State
    const resetChat = () => {
        setMode("initial");
        setMessages([]);
        setInput("");
        setIsLoading(false);
    };

    const handleWhatsApp = () => {
        window.open("https://wa.me/96871777161", "_blank");
        setIsOpen(false);
        // Do NOT reset here
    };

    const handleStartChat = () => {
        setMode("language");
    };

    const selectLanguage = (lang: "en" | "ar") => {
        setChatLang(lang);
        setMode("chat");
        // Add welcome message
        const welcome = lang === "en"
            ? "Hello! I'm Zenia, your virtual assistant. How can I help you today?"
            : "مرحباً! أنا زينيا، مساعدتك الافتراضية. كيف يمكنني مساعدتك اليوم؟";
        setMessages([{ role: "assistant", content: welcome }]);
    };

    // Close Button (Top Right) -> Minimize logic requested
    const handleMinimize = () => {
        setIsOpen(false);
    };

    const handleEndChat = () => {
        resetChat();
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user" as const, content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    language: chatLang,
                    history: messages.slice(-5) // Send last 5 messages for context
                }),
            });

            if (!res.ok) throw new Error("Failed to send message");

            const data = await res.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: chatLang === "en"
                        ? "I apologize, I'm having trouble connecting right now. Please try again later or contact us on WhatsApp."
                        : "عذراً، أواجه مشكلة في الاتصال حالياً. يرجى المحاولة لاحقاً أو التواصل معنا عبر الواتساب."
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button Container with RTL positioning */}
            {!isOpen && (
                <div className={`fixed bottom-6 z-50 flex items-center gap-2 ${isRTL ? 'left-6 flex-row-reverse' : 'right-6 flex-row'}`}>
                    {/* Toggle Arrow */}
                    <motion.button
                        className="bg-white text-primary shadow-lg rounded-full p-2 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsTextVisible(!isTextVisible)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {(isTextVisible && !isRTL) || (!isTextVisible && isRTL) ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </motion.button>

                    <motion.button
                        className={`flex items-center gap-2 bg-primary text-primary-foreground rounded-full shadow-lg p-1 h-14 hover:shadow-xl transition-all hover:scale-105 ${isRTL ? 'pl-6 pr-1' : 'pr-6 pl-1'}`}
                        onClick={() => setIsOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {/* Avatar */}
                        <div className="relative w-12 h-12 shrink-0">
                            <img
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                alt="Zenia"
                                className="w-full h-full rounded-full object-cover border-2 border-white"
                            />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                        </div>

                        {/* Text */}
                        <AnimatePresence>
                            {isTextVisible && (
                                <motion.span
                                    initial={{ width: 0, opacity: 0, marginLeft: 0, marginRight: 0 }}
                                    animate={{
                                        width: "auto",
                                        opacity: 1,
                                        marginLeft: isRTL ? 0 : 8,
                                        marginRight: isRTL ? 8 : 0
                                    }}
                                    exit={{ width: 0, opacity: 0, marginLeft: 0, marginRight: 0 }}
                                    className="font-bold text-sm uppercase tracking-wide whitespace-nowrap overflow-hidden"
                                >
                                    {isRTL ? "اسأل زينيا أي شيء" : "ASK ZENIA ANYTHING"}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`fixed bottom-24 z-50 w-80 md:w-96 ${isRTL ? 'left-6' : 'right-6'}`}
                    >
                        <Card className="shadow-2xl border-0 overflow-hidden rounded-2xl">
                            {/* Header */}
                            <div className="bg-primary p-4 flex items-center justify-between" dir={isRTL ? "rtl" : "ltr"}>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img
                                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                            alt="Zenia"
                                            className="w-10 h-10 rounded-full object-cover border-2 border-primary-foreground/20"
                                        />
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-primary rounded-full"></span>
                                    </div>
                                    <div>
                                        <h3 className="text-primary-foreground font-bold text-lg">
                                            {isRTL ? "زينيا" : "Zenia"}
                                        </h3>
                                        <p className="text-primary-foreground/80 text-xs flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                            {isRTL ? "متصل" : "Online"}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
                                    onClick={handleMinimize}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <CardContent className="h-96 p-0 bg-gray-50 flex flex-col">
                                {/* Initial Mode */}
                                {mode === "initial" && (
                                    <div className="flex-1 flex flex-col justify-center items-center p-6 space-y-4 animate-in fade-in slide-in-from-bottom-5">
                                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                                            <Bot className="w-10 h-10 text-primary" />
                                        </div>
                                        <p className="text-center text-gray-600 mb-6 font-medium">
                                            {isRTL ? "مرحباً! أنا زينيا." : "Hi! I'm Zenia."} <br />
                                            {isRTL ? "كيف يمكنني مساعدتك اليوم؟" : "How can I assist you today?"}
                                        </p>
                                        <Button
                                            className="w-full bg-green-500 hover:bg-green-600 text-white gap-3 h-14 text-base rounded-xl shadow-sm"
                                            onClick={handleWhatsApp}
                                        >
                                            <Phone className="w-5 h-5" />
                                            {isRTL ? "دردشة عبر واتساب" : "Chat on WhatsApp"}
                                        </Button>
                                        <Button
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-3 h-14 text-base rounded-xl shadow-sm"
                                            onClick={handleStartChat}
                                        >
                                            <Bot className="w-5 h-5" />
                                            {isRTL ? "تحدث مع زينيا (ذكاء اصطناعي)" : "Chat with Zenia (AI)"}
                                        </Button>
                                    </div>
                                )}

                                {/* Language Selection */}
                                {mode === "language" && (
                                    <div className="flex-1 flex flex-col justify-center items-center p-6 space-y-4 animate-in fade-in slide-in-from-right-5">
                                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                                            <MessageCircle className="w-10 h-10 text-primary" />
                                        </div>
                                        <p className="text-center text-gray-600 mb-6 font-medium">
                                            Please select your language<br />
                                            الرجاء اختيار اللغة
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="w-full hover:bg-primary/5 border-primary/20 h-12 text-base rounded-xl"
                                            onClick={() => selectLanguage("en")}
                                        >
                                            English
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full hover:bg-primary/5 border-primary/20 h-12 text-base rounded-xl font-arabic"
                                            onClick={() => selectLanguage("ar")}
                                        >
                                            العربية
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-4 text-gray-400 hover:text-gray-600"
                                            onClick={() => setMode("initial")}
                                        >
                                            {isRTL ? "رجوع" : "Back"}
                                        </Button>
                                    </div>
                                )}

                                {/* Chat Interface */}
                                {mode === "chat" && (
                                    <>
                                        <div className="flex-1 overflow-y-auto p-4 space-y-3" dir={chatLang === "ar" ? "rtl" : "ltr"}>
                                            {messages.map((msg, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                                >
                                                    {msg.role === "assistant" && (
                                                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mr-2 border border-gray-200 self-end mb-1">
                                                            <img
                                                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                                                alt="Zenia"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === "user"
                                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                                            : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                                                            }`}
                                                    >
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            ))}
                                            {isLoading && (
                                                <div className="flex justify-start">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mr-2 border border-gray-200 self-end mb-1">
                                                        <img
                                                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                                            alt="Zenia"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 border border-gray-100 shadow-sm">
                                                        <div className="flex gap-1">
                                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>

                                        <div className="p-3 bg-white border-t" dir={chatLang === "ar" ? "rtl" : "ltr"}>
                                            <form
                                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                                className="flex gap-2"
                                            >
                                                {/* End Chat Button - Near Typing */}
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="outline"
                                                    className="rounded-full shrink-0 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                                                    onClick={handleEndChat}
                                                    title="End Chat"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                <Input
                                                    value={input}
                                                    onChange={(e) => setInput(e.target.value)}
                                                    placeholder={chatLang === "ar" ? "اكتب رسالتك..." : "Type a message..."}
                                                    className="resize-none rounded-full focus-visible:ring-primary/20 focus-visible:border-primary"
                                                />
                                                <Button
                                                    type="submit"
                                                    size="icon"
                                                    className="rounded-full bg-primary hover:bg-primary/90 shrink-0 shadow-sm"
                                                    disabled={isLoading || !input.trim()}
                                                >
                                                    <Send className={`w-4 h-4 ${chatLang === "ar" ? "rotate-180" : ""}`} />
                                                </Button>
                                            </form>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
