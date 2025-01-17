<?php

class Key
{
  static private $PRIVATE_KEY = "these bananas are great";

  public static function encode(string $payload): string
  {
    $iv_length = openssl_cipher_iv_length('AES-256-CBC');
    $iv = openssl_random_pseudo_bytes($iv_length);
    $encrypted = openssl_encrypt($payload, 'AES-256-CBC', Key::$PRIVATE_KEY, 0, $iv);
    return base64_encode($iv . $encrypted);
  }

  public static function decode(string $encrypted_message): string | false
  {
    $iv_length = openssl_cipher_iv_length('AES-256-CBC');
    $encrypted_message = base64_decode($encrypted_message);
    $iv = substr($encrypted_message, 0, $iv_length);
    $encrypted_message = substr($encrypted_message, $iv_length);
    return openssl_decrypt($encrypted_message, 'AES-256-CBC', Key::$PRIVATE_KEY, 0, $iv);
  }
}