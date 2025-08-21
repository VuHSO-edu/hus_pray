import React, { useState } from 'react';
import axios from 'axios';
import './PrayForm.css';

const PrayForm = () => {
    const [email, setEmail] = useState('');
    const [wish, setWish] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [errors, setErrors] = useState({});
    const [isTyping, setIsTyping] = useState(false);

    const typeWriter = (text, callback) => {
        setIsTyping(true);
        let i = 0;
        const speed = 50;

        const type = () => {
            if (i < text.length) {
                callback(text.substring(0, i + 1));
                i++;
                setTimeout(type, speed);
            } else {
                setIsTyping(false);
            }
        };
        type();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setResponse(null);

        try {
            const result = await axios.post('http://localhost:8080/api/pray/submit', {
                email: email,
                wish: wish
            });

            if (result.data.success) {
                const successResponse = {
                    type: 'success',
                    message: result.data.message,
                    advice: '',
                    fullAdvice: result.data.data.advice,
                    source: result.data.data.source,
                    timestamp: result.data.data.timestamp
                };

                setResponse(successResponse);

                typeWriter(result.data.data.advice, (partialText) => {
                    setResponse(prev => ({...prev, advice: partialText}));
                });

                setEmail('');
                setWish('');
            }
        } catch (error) {
            if (error.response?.data) {
                const errorData = error.response.data;

                if (errorData.data && typeof errorData.data === 'object') {
                    setErrors(errorData.data);
                } else {
                    setResponse({
                        type: 'error',
                        message: errorData.data || 'Có lỗi xảy ra'
                    });
                }
            } else {
                setResponse({
                    type: 'error',
                    message: 'Không thể kết nối đến hệ thống cầu nguyện 🏛️'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pray-container">
            <div className="pray-booth">
                <div className="university-header">
                    <div className="university-logo">🏛️</div>
                    <h1>ĐẠI HỌC KHOA HỌC TỰ NHIÊN</h1>
                    <h2>ĐHQG HÀ NỘI</h2>
                    <div className="university-motto">
                        <span>🌸 "Tri thức - Đạo đức - Sáng tạo" 🌸</span>
                    </div>
                    <div className="temple-section">
                        <h3>🏮 ĐIỆN THỜ VĂN CHANG 🏮</h3>
                        <p>Nơi cầu nguyện thành tựu học tập và nghiên cứu</p>
                    </div>
                </div>

                {loading && (
                    <div className="loading-ceremony">
                        <div className="incense-animation">
                            <span className="smoke">📿</span>
                            <span className="fire">🕯️</span>
                            <span className="lotus">🪷</span>
                        </div>
                        <p>Thầy cúng đang cầu nguyện cho thành tựu học tập của bạn...</p>
                        <div className="loading-dots">
                            <span>.</span><span>.</span><span>.</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="pray-form">
                    <div className="form-group">
                        <label>📧 Email sinh viên/nghiên cứu sinh:</label>
                        <input
                            type="email"
                            placeholder="username@hus.edu.vn hoặc email cá nhân..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={errors.email ? 'error' : ''}
                            disabled={loading}
                        />
                        {errors.email && (
                            <div className="error-message">⚠️ {errors.email}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>🙏 Ước nguyện học tập/nghiên cứu của bạn:</label>
                        <textarea
                            placeholder="Ví dụ: Cầu mong đậu kỳ thi cuối kỳ Toán cao cấp, hoàn thành luận văn tốt nghiệp, được nhận vào chương trình nghiên cứu sinh..."
                            value={wish}
                            onChange={(e) => setWish(e.target.value)}
                            rows="5"
                            className={errors.wish ? 'error' : ''}
                            disabled={loading}
                        />
                        {errors.wish && (
                            <div className="error-message">⚠️ {errors.wish}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-btn"
                    >
                        {loading ? '🙏 ĐANG CẦU NGUYỆN...' : '🕯️ THẮP NẾN CẦU NGUYỆN'}
                    </button>
                </form>

                {response && response.type === 'success' && (
                    <div className="wisdom-scroll">
                        <div className="scroll-header">
                            <h3>📜 Lời khuyên từ {response.source}</h3>
                            <small className="timestamp">⏰ {response.timestamp}</small>
                        </div>

                        <div className="wisdom-content">
                            <div className="advice-decoration">🌸 ❀ 🌸</div>
                            <p className="advice-text">
                                {response.advice}
                                {isTyping && <span className="cursor">|</span>}
                            </p>
                            <div className="advice-decoration">🌸 ❀ 🌸</div>
                        </div>

                        <div className="blessing-footer">
                            <p>🏛️ Thành kính cúi chào Thánh Văn Xương Đế Quân 🏛️</p>
                            <p>🌸 Nam mô A Di Đà Phật 🌸</p>
                            <small>Chúc các bạn sinh viên, nghiên cứu sinh luôn thông minh, sáng suốt trong học tập!</small>
                        </div>
                    </div>
                )}

                {response && response.type === 'error' && (
                    <div className="error-shrine">
                        <h3>😔 Có chút trục trặc</h3>
                        <p>{response.message}</p>
                        <small>Vui lòng thử lại sau. Thầy cúng có thể đang bận cúng dường.</small>
                    </div>
                )}

                <div className="university-footer">
                    <p>🏛️ <strong>Đại học Khoa học Tự nhiên - ĐHQG Hà Nội</strong></p>
                    <p>📍 19 Lê Thánh Tông, Hoàn Kiếm, Hà Nội</p>
                    <p>🌐 hus.vnu.edu.vn | ☎️ (024) 38252044</p>
                </div>
            </div>
        </div>
    );
};

export default PrayForm;
// Note: Ensure you have the necessary backend API running at http://localhost:8080/api/pray/submit
// and that CORS is properly configured to allow requests from your frontend application.