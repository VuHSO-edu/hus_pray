package hus.vuhso.backend.service;

import hus.vuhso.backend.DTO.response.AdviceResponse;

import java.util.Random;

@Service
public class HUSAdviceService {

    private static final Logger log = LoggerFactory.getLogger(HUSAdviceService.class);
    private final ChatClient chatClient;

    @Autowired
    public HUSAdviceService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder
                .defaultSystem("""
                Bạn là Thầy Trí Tuệ - một vị cao tăng giàu kinh nghiệm, được tôn thờ tại Điện Văn Xương 
                của Đại học Khoa học Tự nhiên - ĐHQG Hà Nội.
                
                Bạn có nhiều năm kinh nghiệm hướng dẫn sinh viên, nghiên cứu sinh về:
                - Học tập các môn Toán, Lý, Hóa, Sinh, Địa lý, Môi trường
                - Nghiên cứu khoa học và viết luận văn/luận án
                - Vượt qua khó khăn trong quá trình học tập
                - Phát triển tư duy logic và sáng tạo
                
                Nhiệm vụ của bạn:
                - Đưa ra lời khuyên thiết thực, khoa học và có căn cứ
                - Phù hợp với truyền thống học thuật của HUS
                - Khuyến khích tinh thần nghiên cứu và tìm hiểu
                - Giọng điệu ân cần như một người thầy trí thức
                - Độ dài 3-4 câu, mang tính động viên và hướng dẫn cụ thể
                - Có thể đề cập đến phương pháp học tập hiệu quả
                """)
                .build();
    }

    public AdviceResponse generateAdvice(String wish, String email) {
        try {
            String userPrompt = String.format(
                    "Một sinh viên/nghiên cứu sinh của Đại học Khoa học Tự nhiên - ĐHQG Hà Nội " +
                            "với email %s vừa thắp nến cầu nguyện tại Điện Văn Xương: '%s'\n\n" +
                            "Hãy đưa ra lời khuyên phù hợp để giúp sinh viên này đạt được mục tiêu học tập.",
                    maskEmail(email), wish
            );

            String aiResponse = chatClient.prompt()
                    .user(userPrompt)
                    .call()
                    .content();

            log.info("Academic advice generated for HUS student wish: {}",
                    wish.substring(0, Math.min(wish.length(), 50)));

            AdviceResponse response = new AdviceResponse(aiResponse.trim());
            response.setSource("Thầy Trí Tuệ - Điện Văn Xương HUS");

            return response;

        } catch (Exception e) {
            log.error("Error generating academic advice: ", e);
            return new AdviceResponse(getFallbackAcademicAdvice());
        }
    }

    private String getFallbackAcademicAdvice() {
        String[] academicWisdom = {
                "📚 Học tập là một hành trình dài, hãy kiên trì và đặt mục tiêu rõ ràng cho từng giai đoạn. Thành công sẽ đến với những ai không ngừng nỗ lực!",
                "🔬 Nghiên cứu khoa học đòi hỏi sự tỉ mỉ và kiên nhẫn. Hãy bắt đầu từ những bước nhỏ và tích lũy kiến thức mỗi ngày.",
                "💡 Tư duy logic và sáng tạo là chìa khóa thành công trong khoa học tự nhiên. Hãy luôn đặt câu hỏi 'Tại sao?' và 'Làm thế nào?'",
                "📖 Việc đọc sách và tham khảo tài liệu đa dạng sẽ mở rộng tầm nhìn của bạn. Hãy xây dựng thói quen học tập đều đặn mỗi ngày.",
                "🎯 Hãy tận dụng tài nguyên phong phú tại HUS: thầy cô, thư viện, phòng thí nghiệm. Đừng ngại hỏi khi gặp khó khăn!",
                "🌱 Mỗi thử thách trong học tập là cơ hội để bạn phát triển. Hãy biến áp lực thành động lực để tiến bộ hơn mỗi ngày."
        };

        Random random = new Random();
        return academicWisdom[random.nextInt(academicWisdom.length)];
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "sinh viên HUS";
        if (email.contains("hus.edu.vn")) return "sinh viên HUS";
        String[] parts = email.split("@");
        return parts[0].substring(0, Math.min(3, parts.length())) + "***@" + parts[1];
    }
}

