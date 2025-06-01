FROM eclipse-temurin:17-jdk

RUN apt-get update && apt-get install -y python3 python3-pip python3-venv && apt-get clean

RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN pip install --no-cache-dir openai

ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar

COPY src/main/java/com/skycastle/mindtune/model/function_call.py /app/function_call.py
COPY src/main/java/com/skycastle/mindtune/model/generate_music.py /app/generate_music.py
COPY src/main/java/com/skycastle/mindtune/model/generate_response.py /app/generate_response.py
COPY src/main/java/com/skycastle/mindtune/model/stt.py /app/stt.py

ENTRYPOINT ["java", "-jar", "/app.jar"]
