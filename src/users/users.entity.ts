import { RefreshToken } from 'src/auth/auth.refresh.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(() => RefreshToken, (refreshTokens) => refreshTokens.user, {
    eager: true,
  })
  refreshToken: RefreshToken[];
}
