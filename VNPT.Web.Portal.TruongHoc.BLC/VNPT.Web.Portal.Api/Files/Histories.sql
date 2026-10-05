create     PROCEDURE [dbo].[Get_History] @p_id uniqueidentifier = NULL
AS
BEGIN
 SET NOCOUNT ON;
 SELECT
  h.*,
		u."LastName"+ ' ' + u."FirstName" as "UserName" 
 FROM Histories h
	LEFT JOIN "Users" u ON u."Id" = h."CreateUserId"
 WHERE @p_id = h.Id;

END
GO
/****** Object:  StoredProcedure [dbo].[Histories_list]    Script Date: 5/16/2024 3:03:41 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create     PROCEDURE [dbo].[Histories_list] 
@p_item_id uniqueidentifier = NULL,
@p_user_id nvarchar(200) = NULL,
@p_fromdate datetime = NULL,
@p_todate datetime = NULL,
@p_action int = null,
@p_page_index int = 1,
@p_page_size int = 10
AS
BEGIN
 SET NOCOUNT ON;
 SELECT
  * INTO #historyTemp
 FROM Histories h
 WHERE (@p_user_id IS NULL
 OR h."CreateUserId" = @p_user_id)
 AND (@p_item_id IS NULL
 OR h."ItemId" = @p_item_id)
 AND (((@p_fromdate IS NULL
 AND @p_todate IS NULL)
 OR (@p_fromdate IS NOT NULL
 AND @p_todate IS NOT NULL
 AND h."CreateDate" BETWEEN @p_fromdate AND @p_todate)
 OR (@p_fromdate IS NOT NULL
 AND @p_todate IS NULL
 AND h."CreateDate" >= @p_fromdate)
 OR (@p_fromdate IS NULL
 AND @p_todate IS NOT NULL
 AND h."CreateDate" <= @p_todate)))
	and (@p_action is null or h.Action = @p_action)
 ;

 SELECT
  h2.*,
		u."LastName"+ ' ' + u."FirstName" as "UserName"
 FROM (SELECT
  *
 FROM #historyTemp AS ht
 ORDER BY ht."CreateDate" DESC OFFSET ((@p_page_index - 1) * @p_page_size) ROWS FETCH NEXT @p_page_size ROWS ONLY) h2
	LEFT JOIN "Users" u ON u."Id" = h2."CreateUserId";

	select count(*) as TotalRow
	from  #historyTemp AS ht;
END
GO
