import { ApiProperty } from "@nestjs/swagger";


export class ReservationHistoryDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  roomId: string;
  @ApiProperty()
  startTime: Date;
  @ApiProperty()
  endTime: Date;
}
