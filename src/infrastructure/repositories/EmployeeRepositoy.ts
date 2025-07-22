import { IEmployeeRepository } from "../../domain/repositories/IEmployeeRepository";
import { Employee } from "../../domain/entities/Employee";
import {EmployeeStats} from "../../usecases/dtos/EmployeeDTO";
import { EmployeeModel } from "../persistence/models/EmployeeModel";
import { SortOrder } from "../config/database";
import { Filter } from "../../../types/express";
import { toEmployeeEntityFromDoc, toEmployeeEntitiesFromDoc } from "../mappers/employeeDataMapper";
import { EmployeePersistanceType } from "../types/EmployeeTypes";
import { BaseRepository } from "./BaseRepository";
import { IEmployeeDocument } from "../persistence/interfaces/IEmployeeModel";

export class EmployeeRepository extends BaseRepository<Employee, IEmployeeDocument> implements IEmployeeRepository {

  constructor(){
    super(EmployeeModel, toEmployeeEntityFromDoc, toEmployeeEntitiesFromDoc)
  }
  
  async findByEmail(email: string): Promise<Employee | null> {
    try {
      const employee = await EmployeeModel.findOne({ email });
      return employee ? toEmployeeEntityFromDoc(employee): null;
    } catch (error) {
      throw new Error("something happend in findByEmail");
    };
  };
  
  async blockById(employeeId: string, status: boolean): Promise<boolean | null> {
    try {
      const employees = await EmployeeModel.findByIdAndUpdate(
        employeeId,
        { isBlocked: status },
        { new: true }
      );

      return employees ? true: null;
    } catch (error) {
      throw new Error("something happend in blockById");
    };
  };

  async dashboardData(filterConstraints: Filter): Promise<EmployeeStats[] | null> {
    try {
      const result = await EmployeeModel.aggregate([
        {
          $facet: {
            totalEmployees: [{ $count: 'count' }],
            activeEmployees: [
              { $match: { isBlocked: false } },
              { $count: 'count' },
            ],
          },
        },
      ]);
      
      return result;
    } catch (error) {
      throw new Error('something happend in dashboardData');
    };
  };
};
