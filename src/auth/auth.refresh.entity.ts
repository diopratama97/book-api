import { Users } from 'src/users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  isRevoked: boolean;

  @Column()
  expiredAt: Date;

  @ManyToOne(() => Users, (user) => user.refreshToken)
  user: Users;
}
