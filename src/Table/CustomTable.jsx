import React from 'react';
import { Button, Card, Dropdown, Form, Pagination, Table } from 'react-bootstrap';
import { SpinnerOverlay, ZeroState, ErrorState } from '../Components';
import { STATUS } from '../Utils/Constant';
import "boxicons";
import "./CustomTable.css";

const CustomTable = ({
    className,
    title,
    headers,
    records,
    totalRecords,
    primaryBtnHeader,
    primaryBtnHandler,
    handleRecordEdit,
    handleDeleteRecord,
    pageNumber,
    setPageNumber,
    handleSearch,
    dropdownOptions,
    isError = false,
    isLoading = false}) =>  
  {
  const numberOfRecords = records?.length || "0";
  const dataStatus = isError ? STATUS.ERROR : (records?.length ? STATUS.NOT_EMPTY : STATUS.EMPTY);

  const renderTableBody = (status) => {
    switch (status) {
      case STATUS.EMPTY:
        return <ZeroState />;
      case STATUS.ERROR:
        return <ErrorState />;
      default:
      case STATUS.NOT_EMPTY:
        return ((<><thead className='table-heading'>
          <tr>
            <th>#</th>
            {headers.map((column, index) => (
              <th className='' key={index}>{column.name}</th>
            ))}
          </tr>
        </thead>
          <tbody className='table-group-divider'>
            {records.map((record, index) =>
            (
              <tr className='table-row'>
                <td>{(pageNumber-1)*25+index + 1}</td>
                {headers.map((key) => (
                  <td>{key.onClick ? key.onClick(record) : (record[key.accessorKey] || (record[key.accessorKey] === 0 ? 0: "-"))}</td>
                ))

                }
                {dropdownOptions?.length ? <td className=''>
                <Dropdown>
                  <Dropdown.Toggle className="table-dropdown-toggle" variant="light" id="dropdown-basic">
                    :
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {dropdownOptions.map((option) => (
                      <Dropdown.Item className={option.className} onClick={() => option.onClick && option.onClick(record)}>{option.name}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                </td>: null}
              </tr>
            )
            )}

          </tbody></>))
    }
  }

  return (
    <Card className={`table-card ${className}`}>
      {isLoading && <SpinnerOverlay />}

      <div className="d-flex gap-3 justify-content-between align-items-center table-card-name">
        <h4 className='mb-0'>{title}</h4>
        { !isError &&
        <div className='d-flex gap-4'>
          <div className='d-flex gap-2'>
            <Form.Control size='sm' type="text" placeholder="Search here" onChange={(e) => handleSearch(e.target.value)}/>
          </div>
          {primaryBtnHeader && <Button size='md' className='rounded-3' onClick={primaryBtnHandler}>{primaryBtnHeader}</Button>}
        </div> }
      </div>
      <Table responsive borderless hover size="sm">
        {renderTableBody(dataStatus)}
      </Table>
      {records?.length > 0 && !isError &&
        (<div className='justify-content-end pagination d-flex align-items-center gap-4 mt-4'>
          <h6 className='mb-0'>{numberOfRecords} of {totalRecords}</h6>
          {numberOfRecords < totalRecords && <Pagination >
            <Pagination.Prev onClick={() => setPageNumber(pageNumber-1)} disabled={pageNumber === 1}/>
            <Pagination.Item active>{pageNumber}</Pagination.Item>
            <Pagination.Next onClick={() => setPageNumber(pageNumber+1)} disabled={Math.ceil(totalRecords/25) == pageNumber}/>
          </Pagination>}
        </div>)
      }
    </Card>
  )
}

export default CustomTable;