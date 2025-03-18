import { IEmployeeRepository } from "../../domain/repositories/IEmployeeRepository";
import { Employee } from "../../domain/entities/Employee";
import {
  EmployeeAccessDTO,
  EmployeeCreate,
  EmployeeStats,
} from "../../usecases/dtos/EmployeeDTO";
import { EmployeeModel } from "../persistence/models/EmployeeModel";
import { SortOrder } from "../config/database";
import { Filter } from "../../../types/express";
export class EmployeeRepository implements IEmployeeRepository {
    
  async findByEmail(email: string): Promise<EmployeeAccessDTO | null> {
    try {
      const employee = await EmployeeModel.findOne({ email });
      return employee
        ? {
            id: employee.id,
            name: employee.name,
            email: employee.email,
            isBlocked: employee.isBlocked,
            password: employee.password,
          }
        : null;
    } catch (error) {
      throw new Error("something happend in findByEmail");
    }
  }

  async findById(employeeId: string): Promise<EmployeeAccessDTO | null> {
    try {
      const employee = await EmployeeModel.findById(employeeId);

      return employee
        ? {
            id: employee.id,
            name: employee.name,
            email: employee.email,
            password: employee.password,
            isBlocked: employee.isBlocked,
            createdAt: employee.createdAt.toLocaleDateString(),
          }
        : null;
    } catch (error) {
      throw new Error("somethign happend in findById");
    }
  }

  async findAll<T>(
    query: Record<string, T> = {},
    sort: { [key: string]: SortOrder } = {},
    skip: number = 0,
    limit: number = 0
  ): Promise<{ employee: Employee[]; total: number } | null> {
    try {
      const employee = await EmployeeModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);
      const emp = employee.map(
        (emp) =>
          new Employee(
            emp.id,
            emp.name,
            emp.email,
            emp.password,
            emp.isBlocked,
            emp.createdAt.toLocaleDateString()
          )
      );

      const total = await EmployeeModel.countDocuments(query);
      return { employee: emp, total: total };
    } catch (error) {
      throw new Error("something happend in findAll");
    }
  }

  async create(employeeData: EmployeeCreate): Promise<void> {
    try {
      const newEmployee = new EmployeeModel({
        name: employeeData.name,
        email: employeeData.email,
        password: employeeData.password,
        isBlocked: false,
      });

      await newEmployee.save();
    } catch (error) {
      throw new Error("something happend in create");
    }
  }

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
  }

  async updatePassword(employeeId: string, newPassword: string): Promise<boolean | null> {
    try {
      const employee = await EmployeeModel.findByIdAndUpdate(
        employeeId,
        { password: newPassword },
        { new: true }
      );
      if (employee) {
        return true;
      }

      return null;
    } catch (error) {
      throw new Error("something happend in update password");
    }
  }

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
