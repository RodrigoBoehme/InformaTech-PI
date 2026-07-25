import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './User'
import { RescueRequest } from './RescueRequest'

/**
 * Entidade que registra a intenção de um voluntário ajudar em determinado pedido.
 */
export type HelpStatus = 'OFFERED' | 'ACCEPTED' | 'COMPLETED' | 'CANCELED'

@Entity('help_offers')
export class HelpOffer {
  @PrimaryGeneratedColumn('uuid') id!: string
  @Column({ type: 'text' }) message!: string
  @Column({ type: 'enum', enum: ['OFFERED', 'ACCEPTED', 'COMPLETED', 'CANCELED'], default: 'OFFERED' }) status!: HelpStatus
  @Column() volunteerId!: string
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' }) @JoinColumn({ name: 'volunteerId' }) volunteer!: User
  @Column() requestId!: string
  @ManyToOne(() => RescueRequest, request => request.helpOffers, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'requestId' }) request!: RescueRequest
  @CreateDateColumn() createdAt!: Date
  @UpdateDateColumn() updatedAt!: Date
}
