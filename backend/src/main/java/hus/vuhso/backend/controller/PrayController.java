package hus.vuhso.backend.controller;

import hus.vuhso.backend.DTO.request.WishRequest;
import hus.vuhso.backend.DTO.response.AdviceResponse;
import hus.vuhso.backend.DTO.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pray")
@Validated
@CrossOrigin(origins = "http://localhost:3000")
public class PrayController {

   // @Autowired
  //  private AdviceService adviceService;

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<AdviceResponse>> submitWish(
            @Valid @RequestBody WishRequest request) {

        try {
            // Gửi ước nguyện đến AI để xử lý
           // String advice = adviceService.generateAdvice(request.getWish());
         String   advice = "Đây là một lời khuyên mẫu cho ước nguyện: " + request.getWish();
            AdviceResponse adviceResponse = new AdviceResponse(advice);
            ApiResponse<AdviceResponse> response =
                    ApiResponse.success("Ước nguyện đã được gửi thành công!", adviceResponse);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            ApiResponse<AdviceResponse> errorResponse =
                    ApiResponse.error("Có lỗi xảy ra khi xử lý ước nguyện của bạn");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }
}

