import { JwtService } from '@nestjs/jwt';

export function verifyWsToken(token: string) {
  const jwt = new JwtService({ secret: process.env.JWT_SECRET });
  return jwt.verify(token);
}
