import React, { useContext } from 'react'
import { QueryContext } from '../../Context/QueryContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const CsvButton = () => {
    const {queries}=useContext(QueryContext)
    const handleDownloadCSV = () => {
        const csvData = queries.map(query => ({
          _id: query._id,
          userId: query.userId,
          query: query.query,
          Answer: query.Answer,
          Documents: query.Documents.join('; '),
          date: query.date
        }));
    
        const csvContent = [
          ["_id", "userId", "query", "Answer", "Documents", "date"],
          ...csvData.map(row => [row._id, row.userId, row.query, row.Answer, row.Documents, row.date])
        ].map(e => e.join(",")).join("\n");
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'queries.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    
  return (
    <div className="exportCsv">
        <div>
          <button  style={{ width: "280px" }} target="_blank" className="btn btn-info btn-lg" onClick={()=>handleDownloadCSV()}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            <span className="text-dark fs-3 w-100">Export to CSV</span>
          </button>
        </div>
      </div>
  )
}

export default CsvButton