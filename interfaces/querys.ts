export const UPDATE_BOT_STATUS = `UPDATE [dbo].[TBL_BOT_STATUS]
SET [BotStatus] = @BotStatus
,[UpdateDate] = GETDATE()`

export const SELECT_COMMANDS = `SELECT [UID]
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

export const INSERT_COMMANDS = ``

export const UPDATE_COMMANDS = ``

export const DELETE_COMMANDS = ``

export const SELECT_TABOO = `SELECT [UID]
,[Channel]
,[TabooedWord]
,[TimeOut]
,[Reg_Date]
FROM [dbo].[TBL_BOT_TABOO_WORD]
WHERE [Channel] = @Channel`;

export const INSERT_TABOO = `DECLARE @CNT Int

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
END`

export const DELETE_TABOO = `DELETE FROM [dbo].[TBL_BOT_TABOO_WORD]
WHERE [Channel] = @Channel 
AND [TabooedWord] = @TabooedWord`

