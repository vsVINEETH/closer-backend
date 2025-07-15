import { IEmployeeRepository } from "../../domain/repositories/IEmployeeRepository";
import { Employee } from "../../domain/entities/Employee";
import {EmployeeStats} from "../../usecases/dtos/EmployeeDTO";
import { EmployeeModel } from "../persistence/models/EmployeeModel";
import { SortOrder } from "../config/database";
import { Filter } from "../../../types/express";
import { toEmployeeEntityFromDoc, toEmployeeEntitiesFromDoc } from "../mappers/employeeDataMapper";
import { EmployeePersistanceType } from "../types/EmployeeTypes";

export class EmployeeRepository implements IEmployeeRepository {
    
  async findByEmail(email: string): Promise<Employee | null> {
    try {
      const employee = await EmployeeModel.findOne({ email });
      return employee ? toEmployeeEntityFromDoc(employee): null;
    } catch (error) {
      throw new Error("something happend in findByEmail");
    }
  };

  async findById(employeeId: string): Promise<Employee | null> {
    try {
      const employee = await EmployeeModel.findById(employeeId);
      return employee ? toEmployeeEntityFromDoc(employee) : null;
    } catch (error) {
      throw new Error("somethign happend in findById");
    }
  };

  async findAll<T>(
    query: Record<string, T> = {},
    sort: { [key: string]: SortOrder } = {},
    skip: number = 0,
    limit: number = 0
  ): Promise< Employee[] | null> {
    try {
      const employeeDoc = await EmployeeModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);
        return employeeDoc ? toEmployeeEntitiesFromDoc(employeeDoc) : null;
    } catch (error) {
      throw new Error("something happend in findAll");
    };
  };

  async countDocs<T>(query: Record<string, T> = {}): Promise<number> {
    try {
      const totalDocs = await EmployeeModel.countDocuments(query);
      return totalDocs;
    } catch (error) {
      throw new Error("something happend in countDocs");
    }
  };

  async create(employeeData: EmployeePersistanceType): Promise<void> {
    try {
      const newEmployee = new EmployeeModel(employeeData);
      await newEmployee.save();
    } catch (error) {
      throw new Error("something happend in create");
    }
  };

  async blockById(employeeId: string, status: boolean): Promise<boolean | null> {
    try {
      const employees = await EmployeeModel.findByIdAndUpdate(
        employeeId,
        { isBlocked: status },
        { new: true }
      );

      if (employees) {
        return true;
      }

      return null;
    } catch (error) {
      throw new Error("something happend in blockById");
    }
  };

  async updatePassword(employeeId: string, newPassword: string): Promise<boolean | null> {
    try {
      const employee = await EmployeeModel.findByIdAndUpdate(
        employeeId,
        { password: newPassword },
        { new: true }
      );
      return employee ? true : null;
    } catch (error) {
      throw new Error("something happend in update password");
    }
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
    }
  }
}
