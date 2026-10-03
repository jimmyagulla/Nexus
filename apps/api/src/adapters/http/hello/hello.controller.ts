import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IHelloInboundPort } from '@hexagonal-monorepo-template/ports';
import { HelloResponseDto } from './dto/hello-response.dto';

@ApiTags('hello')
@Controller()
export class HelloController {
  constructor(
    @Inject(IHelloInboundPort)
    private readonly helloPort: IHelloInboundPort
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({
    status: 200,
    description: 'Return the hello message.',
    type: HelloResponseDto,
  })
  getHello(): HelloResponseDto {
    const greeting = this.helloPort.execute();

    return { message: greeting.message };
  }
}
