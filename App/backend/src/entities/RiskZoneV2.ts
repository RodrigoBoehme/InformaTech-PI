import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum FloodLevel {
  LOW = 'BAIXO',
  MODERATE = 'MODERADO',
  HIGH = 'ALTO',
  CRITICAL = 'CRITICO',
}

@Entity('risk_zones_v2')
export class RiskZoneV2 {
  @PrimaryGeneratedColumn('uuid')id!: string
  @Column({ type: 'varchar', length: 120 }) name!: string
  @Column({ type: 'text', nullable: true }) description!: string | null
  @Column({ type: 'varchar', length: 256 }) coords!: string
  @Column({ type: 'decimal', precision: 6 , scale: 2, default: 0 }) riverLevelMeters!: number
  @Column({ type: 'varchar', length: 20 })floodLevel!: FloodLevel
  @Column({ type: 'boolean', default: true }) active!: boolean
  @Column({ type: 'varchar', length: 36, nullable: true }) createdBy!: string | null
  @CreateDateColumn()createdAt!: Date
  @UpdateDateColumn() updatedAt!: Date
}
