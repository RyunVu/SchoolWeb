export enum ResultCode {
    NoPermission = 100,
    UserNotExists = 101,
    Success = 200,
    Fail = 201,
    UnSuccess = 201,
    UnAuthentication = 401,
    NotPermission = 402,
    NotFoundData = 404,
    DataNotEnough = 414,
    Duplication = 405,
    Deleted = 406,
    DataInUse = 407,
    ForeignKeyNotFound = 410,
    DeleteFailByForeignKey = 411,
    Exception = 500,
    UnknownError = 501,
    UserCreateNotExists = 600,
    NotUnitCode = 1000,
    ExpiredTime = 3010
}
export class ResultModel {
    Code!: ResultCode;
    Message!: string;
    Result!: any;
    TotalRow!: number;
    Domain!: string;
}