import { ApiProperty } from "@nestjs/swagger";


export class ReservationHistoryDTO {

  @ApiProperty()
 roomId: string;
  @ApiProperty()
  startTime: Date;
  @ApiProperty()
  endTime: Date;
}
