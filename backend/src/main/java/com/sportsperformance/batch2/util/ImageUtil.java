package com.sportsperformance.batch2.util;

import java.util.Base64;

public class ImageUtil {
    public static String convertToBase64(byte[] image) {
        return image != null ? Base64.getEncoder().encodeToString(image) : null;
    }
}
