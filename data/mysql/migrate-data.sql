insert into stigman.package select PACKAGEID,NAME,EMASSID,REQRAR,POCNAME,POCEMAIL,POCPHONE from STIGMAN.PACKAGES;
insert into stigman.asset select * from STIGMAN.ASSETS;
insert into stigman.review select * from STIGMAN.REVIEWS;
insert into stigman.asset_package_map select APID,ASSETID,PACKAGEID from STIGMAN.ASSET_PACKAGE_MAP;
insert into stigman.role select * from STIGMAN.ROLES;
insert into stigman.state select * from STIGMAN.STATES;
insert into stigman.status select * from STIGMAN.STATUSES;
insert into stigman.stig_asset_map select * from STIGMAN.STIG_ASSET_MAP;
insert into stigman.user_data select * from STIGMAN.USER_DATA;
insert into stigman.user_stig_asset_map select * from STIGMAN.USER_STIG_ASSET_MAP;