import { useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
 
DataTable.use(DT);
 
export default function Table() {
  const [tableData, setTableData] = useState([
    [ 'Tiger Nixon', 'System Architect' ],
    [ 'Garrett Winters', 'Accountant' ],
    // ...
  ]);
 
  return (
        <DataTable data={tableData} className="display">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Position</th>
                </tr>
            </thead>
        </DataTable>
    );
}