# --- GIAI ĐOẠN 1: BUILD ---
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# 1. Copy toàn bộ bộ máy Gradle vào
# Lưu ý: Phải copy cả thư mục gradle/ để có file gradle-wrapper.jar
COPY gradlew . 
COPY gradle/ gradle/
COPY build.gradle .
COPY settings.gradle .

# 2. Cấp quyền và tải thư viện (Cache layer)
# Dùng "tricky" để Docker không tải lại thư viện nếu build.gradle không đổi
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon

# 3. Copy mã nguồn và đóng gói
COPY src src
RUN ./gradlew bootJar --no-daemon -x test

# --- GIAI ĐOẠN 2: RUNTIME ---
# Dùng Alpine cho cực nhẹ (chỉ khoảng 100-150MB)
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Cài đặt thêm các thư viện hỗ trợ font/đồ họa cơ bản (nếu Spring Boot cần)
RUN apk add --no-cache fontconfig ttf-dejavu

# 4. Copy file .jar từ giai đoạn build
COPY --from=build /app/build/libs/*.jar app.jar

# 5. Cấu hình bộ nhớ cho Render Free (512MB RAM)
# -Xmx300m: Giới hạn tối đa 300MB cho Java để dành 212MB cho hệ điều hành
ENV JAVA_OPTS="-Xmx300m -Xms256m"

# 6. Khai báo cổng (Render mặc định quét cổng này)
EXPOSE 8080

# 7. Lệnh khởi chạy
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]