import {Injectable, UnauthorizedException } from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {User} from './entities/user.schema';
import {Model} from 'mongoose';
import {RegisterDto} from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import {LoginDto} from './dto/login.dto';
import {JwtService} from '@nestjs/jwt';


@Injectable()
export class AuthService{
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ){}
    
    async register(dto: RegisterDto){
        const exists= await this.userModel.findOne({email:dto.email});
        if(exists) throw new UnauthorizedException('User already exists');
        
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const newUser = await this.userModel.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return this.generateTokens(newUser);
        
        
    }
    async login(dto: LoginDto){
        const user = await this.userModel.findOne({email: dto.email});
        if(!user) throw new UnauthorizedException('Invalid credentials');
        
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if(!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
        return this.generateTokens(user);
    }
async refresh(token: string) {
  if (!token) throw new UnauthorizedException('Missing refresh token');

  const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
  const user = await this.userModel.findById(payload.sub);

  if (!user) throw new UnauthorizedException();

  return this.generateTokens(user);
}
      async me(userId: string) {
    return this.userModel.findById(userId).select('-passwordHash');
    
  }
private sanitizeUser(user: User) {
  return {
    _id: (user as any)._id,
    name: user.name,
    email: user.email,
    createdAt: user['createdAt'],
    updatedAt: user['updatedAt'],
  };
}
 private generateTokens(user: User) {
  const payload = { sub: (user as any)._id, email: user.email };
  const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
  const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

  return {
    accessToken,
    refreshToken,
    user: this.sanitizeUser(user),
  };
  }
}