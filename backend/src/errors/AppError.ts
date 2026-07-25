/**
 * Erro de aplicação utilizado para representar falhas esperadas do negócio.
 *
 * Exemplos: usuário não encontrado, e-mail duplicado ou operação sem permissão.
 * Ao lançar este erro dentro de um Service, o middleware central de erros
 * transforma a exceção em uma resposta HTTP adequada.
 */
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode = 400,
  ) {
    super(message)
    this.name = 'AppError'
  }
}
