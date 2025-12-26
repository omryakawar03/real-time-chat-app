import { Controller , Post , Body , Get , Req , UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {RegisterDto} from "./dto/register.dto";

@Controller('auth')
export class AuthController{
constructor(private readonly authService: AuthService){}

@Post('register')
register(@Body() dto: RegisterDto){
    return this.authService.register(dto);
}

@Post('login')
login(@Body() dto: LoginDto){
    return this.authService.login(dto);
}

@Post('refresh')
refresh(@Body('refreshToken') token: string) {
  return this.authService.refresh(token);
}


@UseGuards(JwtAuthGuard)
@Get('me')
me(@Req() req) {
  return this.authService.me(req.user.userId);
}
}