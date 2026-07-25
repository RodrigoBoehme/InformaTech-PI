import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './User'
import { HelpOffer } from './HelpOffer'

/**
 * Entidade que representa um pedido de ajuda georreferenciado.
 * Um pedido pertence a um solicitante e pode ser assumido por um voluntário.
 */
export type RequestStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELED'
export type RequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

@Entity('rescue_requests')
export class RescueRequest {
  @PrimaryGeneratedColumn('uuid') id!: string
  @Column() title!: string
  @Column({ type: 'text' }) description!: string
  @Column() category!: string
  @Column({ type: 'enum', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' }) priority!: RequestPriority
  @Column({ type: 'enum', enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CANCELED'], default: 'OPEN' }) status!: RequestStatus
  @Column('decimal', { precision: 10, scale: 7 }) latitude!: number
  @Column('decimal', { precision: 10, scale: 7 }) longitude!: number
  @Column({ nullable: true }) address?: string
  @Column({ nullable: true }) imageUrl?: string
  @Column() requesterId!: string
  @ManyToOne(() => User, user => user.requests, { eager: true, onDelete: 'CASCADE' }) @JoinColumn({ name: 'requesterId' }) requester!: User
  @Column({ nullable: true }) volunteerId?: string
  @ManyToOne(() => User, { eager: true, nullable: true, onDelete: 'SET NULL' }) @JoinColumn({ name: 'volunteerId' }) volunteer?: User
  @OneToMany(() => HelpOffer, offer => offer.request) helpOffers!: HelpOffer[]
  @CreateDateColumn() createdAt!: Date
  @UpdateDateColumn() updatedAt!: Date
}
