import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { RescueRequest } from './RescueRequest'
import { HelpOffer } from './HelpOffer'

/**
 * Entidade TypeORM que representa uma conta da plataforma.
 * Os decorators definem tabela, colunas e relacionamentos no MySQL.
 */
export type UserRole = 'REQUESTER' | 'VOLUNTEER' | 'ADMIN'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id!: string
  @Column() name!: string
  @Column({ unique: true }) email!: string
  @Column() passwordHash!: string
  @Column() phone!: string
  @Column({ type: 'enum', enum: ['REQUESTER', 'VOLUNTEER', 'ADMIN'], default: 'REQUESTER' }) role!: UserRole
  @Column({ default: true }) active!: boolean
  @CreateDateColumn() createdAt!: Date
  @UpdateDateColumn() updatedAt!: Date
  @OneToMany(() => RescueRequest, request => request.requester) requests!: RescueRequest[]
  @OneToMany(() => HelpOffer, offer => offer.volunteer) helpOffers!: HelpOffer[]
}
