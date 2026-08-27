import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/user.entity';
import { Candidate } from '../candidates/candidate.entity';
import { Company } from '../companies/company.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    await this.usersService.updateLastLogin(user.id);

    // 查关联身份（candidate/company），确保已有用户也能拿到 candidateId/companyId
    const fullUser = await this.usersService.findById(user.id);
    const candidateId = fullUser?.candidate?.id || null;
    const companyId = fullUser?.company?.id || null;

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
        candidateId,
        companyId,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('邮箱已被注册');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      nickname: registerDto.nickname,
      role: registerDto.role || UserRole.CANDIDATE,
    });

    // 根据角色自动创建关联身份记录，确保 candidateId / companyId 不为 null
    let candidateId: number | null = null;
    let companyId: number | null = null;
    if (user.role === UserRole.CANDIDATE) {
      const candidate = this.candidateRepository.create({
        userId: user.id,
        name: registerDto.nickname || registerDto.email,
      });
      const saved = await this.candidateRepository.save(candidate);
      candidateId = saved.id;
    } else if (user.role === UserRole.EMPLOYER) {
      const company = this.companyRepository.create({
        userId: user.id,
        name: registerDto.nickname || '新企业用户',
      });
      const saved = await this.companyRepository.save(company);
      companyId = saved.id;
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
        candidateId,
        companyId,
      },
    };
  }
}
