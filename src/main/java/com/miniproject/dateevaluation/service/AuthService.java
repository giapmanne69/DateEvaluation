package com.miniproject.dateevaluation.service;

import com.miniproject.dateevaluation.model.Client;
import com.miniproject.dateevaluation.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class AuthService {

    @Autowired
    private ClientRepository userRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    /**
     * Logic Đăng ký tài khoản
     */
    public boolean registerAccount(String username, String password, String name, String loveCode) {
        try {
            // Bước 1: Kiểm tra xem username đã có ai dùng chưa
            if (userRepository.existsByUsername(username)) {
                System.out.println("Tên đăng nhập đã tồn tại rồi dcm: " + username);
                return false; // Trùng tên đăng nhập -> Từ chối
            }
            if (userRepository.countByLoveCode(loveCode) >= 2) {
                System.out.println("Mã tình yêu đã đủ 2 người: " + loveCode);   
                return false; // Mã tình yêu đã đủ 2 người -> Từ chối
            }

            // Bước 2: Tạo đối tượng User mới
            Client newUser = new Client();
            newUser.setUsername(username);
            newUser.setFullName(name);
            newUser.setLoveCode(loveCode);
            
            String encodedPassword = encoder.encode(password);
            newUser.setPassword(encodedPassword); 

            // Bước 3: Lưu xuống Database
            userRepository.save(newUser);
            return true;
            
        } catch (Exception e) {
            System.out.println("Lỗi khi đăng ký: " + e.getMessage());
            return false;
        }
    }

    /**
     * Logic Đăng nhập
     */
    public Client authenticate(String username, String password) {
        // Bước 1: Tìm user trong DB dựa vào username
        Client user = userRepository.findByUsername(username);

        String encodedPassword = user != null ? user.getPassword() : null;
        // Bước 2: Nếu tìm thấy user VÀ mật khẩu khớp nhau thì trả về thông tin user đó
        if (user != null && user.getPassword().equals(encodedPassword)) {
            return user;
        }

        // Sai tài khoản hoặc sai mật khẩu
        return null;
    }
}