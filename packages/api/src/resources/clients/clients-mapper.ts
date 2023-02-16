import { ClientDto } from '@etimo-achievements/common';
import { IClient } from '@etimo-achievements/types';

export class ClientsMapper {
  public static toClientDto(client: IClient): ClientDto {
    return {
      id: client.id,
      clientSecret: client.clientSecret,
      description: client.description,
      name: client.name,
      scope: client.scope,
      userId: client.userId,
    };
  }

  public static toClient(dto: ClientDto): IClient {
    return {
      id: dto.id,
      clientSecret: dto.clientSecret,
      description: dto.description,
      name: dto.name,
      scope: dto.scope,
      userId: dto.userId,
    };
  }

  public static isProperty(property: string) {
    const test = ClientsMapper.toClient({} as ClientDto);
    return !!test.hasOwnProperty(property);
  }
}
