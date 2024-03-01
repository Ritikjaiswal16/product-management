import React from 'react';
import { Button, Card, Form, Pagination, Table } from 'react-bootstrap';
import "./CustomTable.css";
import "boxicons";
import SpinnerOverlay from './SpinnerOverlay';
import ZeroState from '../Components/ZeroState';

const CustomTable = ({ tableMetadata, headers, records, totalRecords, isLoading = false, primaryBtnHeader, primaryBtnHandler, doesHaveAction=true }) => {
  const { title } = tableMetadata;
  const numberOfRecords = records?.length || "0";

  return (
    <Card className='table-card m-4 p-4'>
      {isLoading && <SpinnerOverlay />}

      <div className="d-flex p-2 gap-3 justify-content-between align-items-center">
        <h4 className='mb-0'>{title}</h4>
        <div className='d-flex gap-4'>
          <div className='d-flex gap-2'>
            <Form.Control size='sm' className='table-search' type="text" placeholder="Search here" />
            <Button size='sm' >Search</Button>
          </div>
          {primaryBtnHeader && <Button size='sm' onClick={primaryBtnHandler}>{primaryBtnHeader}</Button>}
        </div>
      </div>
      <Table responsive borderless hover size="sm">
        {records?.length ? (<><thead className='table-heading'>
          <tr>
            <th>#</th>
            {headers.map((column, index) => (
              <th className='' key={index}>{column.name}</th>
            ))}
            {doesHaveAction && <th>Actions</th>}
          </tr>
        </thead>
          <tbody className='table-group-divider'>
            {records.map((record, index) =>
            (
              <tr className='table-row'>
                <td>{index + 1}</td>
                {headers.map((key) => (
                  <td>{record[key.accessorKey]}</td>
                ))

                }
                  {doesHaveAction && <td className='d-flex gap-2'>
                    <div className='edit-button'>Edit</div>
                    <div className='delete-button'>Delete</div>
                  </td>}
              </tr>
            )
            )}

          </tbody></>) : <ZeroState />}
      </Table>
      {records?.length > 0 &&
        (<div className='justify-content-end pagination d-flex align-items-center gap-4'>
          <h6 className='mb-0'>{numberOfRecords} of {totalRecords}</h6>
          {numberOfRecords > totalRecords && <Pagination >
            <Pagination.Prev />
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Next />
          </Pagination>}
        </div>)
      }
    </Card>
  )
}

export default CustomTable;