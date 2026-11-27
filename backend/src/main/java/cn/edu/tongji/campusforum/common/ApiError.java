package cn.edu.tongji.campusforum.common;

public record ApiError(String code, String message, int status) {}
