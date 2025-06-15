package com.skycastle.mindtune.voice;

import lombok.Getter;

import java.util.Map;

public class VoiceStyleConfig {

    public static final Map<Integer, VoiceStyle> voiceMap = Map.of(
            1, new VoiceStyle("ko-KR-Standard-D", "<prosody rate='fast' pitch='+4st'>"),
            2, new VoiceStyle("ko-KR-Standard-B", "<prosody rate='slow' pitch='-2st'>"),
            3, new VoiceStyle("ko-KR-Standard-C", "<prosody rate='medium' pitch='-1st'>"),
            4, new VoiceStyle("ko-KR-Standard-A", "<prosody rate='fast' pitch='+3st'>"),
            5, new VoiceStyle("ko-KR-Standard-D", "<prosody rate='medium' pitch='+2st'>"),
            6, new VoiceStyle("ko-KR-Standard-C", "<prosody rate='slow' pitch='-1st'>"),
            7, new VoiceStyle("ko-KR-Standard-A", "<prosody rate='fast' pitch='+5st'>"),
            8, new VoiceStyle("ko-KR-Standard-D", "<prosody rate='x-fast' pitch='+3st'>"),
            9, new VoiceStyle("ko-KR-Standard-B", "<prosody rate='medium' pitch='+4st'>"),
            10, new VoiceStyle("ko-KR-Standard-C", "<prosody rate='slow' pitch='-3st'>")
    );


}