<?php

define("RANDOM_BYTES_STRING", openssl_random_pseudo_bytes(openssl_cipher_iv_length('AES-256-CBC')));
class Key
{
  static private $PRIVATE_KEY = "these bananas are great";
  public static function encode(string $payload): string
  {
    return openssl_encrypt($payload, 'AES-256-CBC', Key::$PRIVATE_KEY, 0, RANDOM_BYTES_STRING);
  }

  public static function decode(string $encrypted_message): string
  {
    return openssl_decrypt($encrypted_message, 'AES-256-CBC', Key::$PRIVATE_KEY, 0, RANDOM_BYTES_STRING);
  }
}