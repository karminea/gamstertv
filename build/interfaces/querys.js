"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_BOT_STATUS = `UPDATE [dbo].[TBL_BOT_STATUS]
SET [BotStatus] = @BotStatus
,[UpdateDate] = GETDATE()`;
exports.SELECT_COMMANDS = `SELECT [UID]
,[Channel]
,[Command]
,[UserType]
,[Response]
,[Enabled]
,[RepeatTime]
,[RepeatEnabled]
,[Reg_Date]
FROM [dbo].[TBL_BOT_COMMANDS]
WHERE [Channel] = @Channel`;
exports.INSERT_COMMANDS = ``;
exports.UPDATE_COMMANDS = ``;
exports.DELETE_COMMANDS = ``;
exports.SELECT_TABOO = `SELECT [UID]
,[Channel]
,[TabooedWord]
,[TimeOut]
,[Reg_Date]
FROM [dbo].[TBL_BOT_TABOO_WORD]
WHERE [Channel] = @Channel`;
exports.INSERT_TABOO = `DECLARE @CNT Int

SELECT @CNT = COUNT(*)
FROM [dbo].[TBL_BOT_TABOO_WORD]
WHERE [Channel] = @Channel 
AND [TabooedWord] = @TabooedWord

IF NOT @CNT > 0
BEGIN
	INSERT INTO [dbo].[TBL_BOT_TABOO_WORD]
	([UID]
	,[Channel]
	,[TabooedWord]
	,[TimeOut]
	,[Reg_Date])
	VALUES
	(NEWID()
	,@Channel
	,@TabooedWord
	,60
	,GETDATE())	
END`;
exports.DELETE_TABOO = `DELETE FROM [dbo].[TBL_BOT_TABOO_WORD]
WHERE [Channel] = @Channel 
AND [TabooedWord] = @TabooedWord`;
//# sourceMappingURL=querys.js.map