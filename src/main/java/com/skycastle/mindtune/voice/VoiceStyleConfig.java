package com.skycastle.mindtune.voice;

import lombok.Getter;

import java.util.Map;

public class VoiceStyleConfig {

    public static final Map<Integer, VoiceStyle> voiceMap = Map.of(
            1, new VoiceStyle("ko-KR-Standard-A", "<prosody rate='fast' pitch='+2st'>"),
            2, new VoiceStyle("ko-KR-Standard-B", "<prosody rate='slow'>"),
            3, new VoiceStyle("ko-KR-Standard-C", "<prosody rate='medium' pitch='-1st'>"),
            4, new VoiceStyle("ko-KR-Standard-D", "<prosody rate='fast' pitch='+1st'>"),
            5, new VoiceStyle("ko-KR-Standard-A", "<prosody pitch='+3st'>"),
            6, new VoiceStyle("ko-KR-Standard-B", "<prosody pitch='-2st'>"),
            7, new VoiceStyle("ko-KR-Standard-C", "<prosody rate='medium' pitch='+2st'>"),
            8, new VoiceStyle("ko-KR-Standard-D", "<prosody rate='fast'>"),
            9, new VoiceStyle("ko-KR-Standard-A", "<prosody pitch='+1st'>"),
            10, new VoiceStyle("ko-KR-Standard-B", "<prosody rate='slow' pitch='-1st'>")
    );

}