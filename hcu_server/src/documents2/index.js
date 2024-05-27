module.exports = ({ listHtml,listHtml2, date, clinic,count }) => {
    const today = new Date();
return `
<!doctype html>
<html>
   <head>
      <meta charset="utf-8">
      <title>PDF Result Template</title>
      <style>
         .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;


            font-size: 16px;
            line-height: 24px;
            font-family: 'Kanit', 'Helvetica';
            height: 100vh;
            color: #555;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
         }
         .margin-top {
            margin-top: 50px;
         }
         .justify-center {
            text-align: center;
         }
         .header {
            display: flex;
            width: 100%;
            flex-direction: column;
            justify-content: flex-end;
            align-items: flex-end;
            position: relative;
            text-align: right;
         }
         .header img {
            position: relative;
            left: 200px;
            top: -15px;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            width: 100px;
            height: 100px;
         }
         .invoice-box table {
            width: 100%;
            line-height: inherit;
            text-align: left;
         }
         .invoice-box table td {
            padding: 5px;
            vertical-align: top;
         }
         .invoice-box table tr.top table td {
            padding-bottom: 20px;
         }
         .invoice-box table tr.top table td.title {
            font-size: 45px;
            line-height: 45px;
            color: #333;
         }
         .invoice-box table tr.information table td {
            padding-bottom: 40px;
         }
         .invoice-box table tr.heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
         }
         .invoice-box table tr.details td {
            padding-bottom: 20px;
         }
         .invoice-box table tr.item td {
            border-bottom: 1px solid #eee;
         }
         .invoice-box table tr.item.last td {
            border-bottom: none;
         }
         .invoice-box table tr.total td:nth-child(2) {
            border-top: 2px solid #eee;
            font-weight: bold;
         }
         .invoice-box table tr td:nth-child(1) {
            text-align: center;
         }
         @media only screen and (max-width: 600px) {
            .invoice-box table tr.top table td {
               width: 100%;
               display: block;
               text-align: center;
            }
            .invoice-box table tr.information table td {
               width: 100%;
               display: block;
               text-align: center;
            }
         }
      </style>
   </head>
   <body>
      <div class="invoice-box">
         <div>
            <div class="header">
               <img src="https://i.imgur.com/NKnMp3K.png" alt="HCU LOGO">
               <b style="margin: 0;margin-right: 20px;">KMUTT Health Care Unit</b>
               <p style="margin: 0;margin-right: 20px;">รายละเอียดการติดต่อ</p>
               <p style="margin: 0;margin-right: 20px;">hcu@kmutt.ac.th</p>
               <p style="margin: 0;margin-right: 20px;">02 470 8446</p>
            </div>
            <div class="center">
               <b style="font-size: 20px;">รายชื่อผู้นัดหมายปรึกษาแพทย์ ${clinic}</b>
               <p style="margin: 0;font-size: 20px; margin-bottom: 20px;">ประจําวันที่ ${date}</p>
            </div>
            <table cellpadding="0" cellspacing="0">
               <tr class="heading">
                  <td>ลําดับที่</td>
                  <td>ชื่อ-นามสกุล</td>
                  <td>สาเหตุการนัดหมาย</td>
                  <td>อาการเบื้องต้น</td>
                  <td>หมายเหตุ</td>
                  <td>ช่วงเวลา</td>
               </tr>
               ${listHtml}
            </table>
         </div>
         <h1 class="justify-center">จํานวนผู้นัดปรึกษาแพทย์รวม ${count} คน</h1>
         ${listHtml2 != "" ?
            `
            <div style="width:100%; border-top:0.5px solid"></div>

         <div class="center" style="margin-top: 100px;">
               <b style="font-size: 20px;">รายชื่อผู้นัดหมาย ${clinic == "คลินิกกายภาพ" ? "ทํากายภาพ" : "ฝังเข็ม"}</b>
               <p style="margin: 0;font-size: 20px; margin-bottom: 20px;">ประจําวันที่ ${date}</p>
            </div>
            <table cellpadding="0" cellspacing="0">
               <tr class="heading">
                  <td>ลําดับที่</td>
                  <td>ชื่อ-นามสกุล</td>
                  <td>สาเหตุการนัดหมาย</td>
                  <td>อาการเบื้องต้น</td>
                  <td>หมายเหตุ</td>
                  <td>ช่วงเวลา</td>
               </tr>
               ${listHtml2}
            </table>
            <h1 class="justify-center">จํานวนผู้นัด${clinic == "คลินิกกายภาพ" ? "ทํากายภาพ" : "ฝังเข็ม"}รวม ${count} คน</h1>
         </div>
         
         `
         : ``}
      </div>
   </body>
</html>


    `;
};