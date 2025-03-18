import { ClientQuery, OptionsCorrectorResult } from "../../../types/express";
import { SearchFilterSortParams } from "../../usecases/dtos/CommonDTO";

export async function paramToQueryAdvertisement(
  options: SearchFilterSortParams
): Promise<OptionsCorrectorResult > {
  const start = options["startDate"]
    ? new Date(options["startDate"] as string)
    : null;
  const end = options["endDate"]
    ? new Date(options["endDate"] as string)
    : null;
  let query: Partial<ClientQuery> = {};

  if (options["search"]) {
    query.$or = [
      { title: { $regex: options["search"], $options: "i" } },
      { subtitle: { $regex: options["search"], $options: "i" } },
    ];
  }

  if (options["status"] !== undefined) {
    query.isListed = options["status"];
  }

  if (start || end) {
    query.createdAt = {};
    if (start) query.createdAt.$gte = start;
    if (end) query.createdAt.$lte = end;
  }

  const sort: { [key: string]: 1 | -1 } = {
    [options["sortColumn"] as string]: options.sortDirection === "asc" ? 1 : -1,
  };

  const skip = (Number(options["page"]) - 1) * Number(options["pageSize"]);
  const limit = parseInt(String(options["pageSize"]), 10);

  return {
    query,
    sort,
    skip,
    limit,
  };
}

export async function paramToQueryEmployee(
  options: SearchFilterSortParams
): Promise<OptionsCorrectorResult> {
  const start = options.startDate ? new Date(options.startDate) : null;
  const end = options.endDate ? new Date(options.endDate) : null;
  let query: Partial<ClientQuery> = {};

  if (options.search) {
    query.$or = [
      { name: { $regex: options.search, $options: "i" } },
      { email: { $regex: options.search, $options: "i" } },
    ];
  }

  if (options.status !== undefined) {
    query.isBlocked = options.status;
  }

  if (start || end) {
    query.createdAt = {};
    if (start) query.createdAt.$gte = start;
    if (end) query.createdAt.$lte = end;
  }

  const sort: { [key: string]: 1 | -1 } = {
    [options.sortColumn]: options.sortDirection === "asc" ? 1 : -1,
  };

  const skip = (options.page - 1) * options.pageSize;
  const limit = options.pageSize;

  return {
    query,
    sort,
    skip,
    limit,
  };
}

export async function paramToQuerySubscription(
  options: SearchFilterSortParams
): Promise<OptionsCorrectorResult> {
  const start = options.startDate ? new Date(options.startDate) : null;
  const end = options.endDate ? new Date(options.endDate) : null;
  let query: Partial<ClientQuery> = {};

  if (options.search) {
    query.$or = [
      { planType: { $regex: options.search, $options: "i" } },
      { planType: { $regex: options.search, $options: "i" } },
    ];
  }

  if (options.status !== undefined) {
    query.isListed = options.status;
  }

  if (start || end) {
    query.createdAt = {};
    if (start) query.createdAt.$gte = start;
    if (end) query.createdAt.$lte = end;
  }

  const sort: { [key: string]: 1 | -1 } = {
    [options.sortColumn]: options.sortDirection === "asc" ? 1 : -1,
  };

  const skip = (options.page - 1) * options.pageSize;
  const limit = options.pageSize;
  return {
    query,
    sort,
    skip,
    limit,
  };
}

export async function paramToQueryUsers(
  options: SearchFilterSortParams
): Promise<OptionsCorrectorResult> {
  const start = options.startDate ? new Date(options.startDate) : null;
  const end = options.endDate ? new Date(options.endDate) : null;
  let query: Partial<ClientQuery> = {};

  if (options.search) {
    query.$or = [
      { username: { $regex: options.search, $options: "i" } },
      { email: { $regex: options.search, $options: "i" } },
    ];
  }

  if (options.status !== undefined) {
    query.isBlocked = options.status;
  }

  if (start || end) {
    query.createdAt = {};
    if (start) query.createdAt.$gte = start;
    if (end) query.createdAt.$lte = end;
  }

  const sort: { [key: string]: 1 | -1 } = {
    [options.sortColumn]: options.sortDirection === "asc" ? 1 : -1,
  };

  const skip = (options.page - 1) * options.pageSize;
  const limit = options.pageSize;

  return {
    query,
    sort,
    skip,
    limit,
  };
}

export async function paramToQueryEvent(
  options: SearchFilterSortParams
): Promise<OptionsCorrectorResult> {
  const start = options.startDate ? new Date(options.startDate) : null;
  const end = options.endDate ? new Date(options.endDate) : null;
  let query: Partial<ClientQuery> = {};

  if (options.search) {
    query.$or = [
      { title: { $regex: options.search, $options: "i" } },
      { description: { $regex: options.search, $options: "i" } },
      { location: { $regex: options.search, $options: "i" } },
    ];
  }

  if (start || end) {
    query.createdAt = {};
    if (start) query.createdAt.$gte = start;
    if (end) query.createdAt.$lte = end;
  }

  const sort: { [key: string]: 1 | -1 } = {
    [options.sortColumn]: options.sortDirection === "asc" ? 1 : -1,
  };

  const skip = (options.page - 1) * options.pageSize;
  const limit = options.pageSize;

  return {
    query,
    sort,
    skip,
    limit,
  };
}

export async function paramToQueryContent(
  options: SearchFilterSortParams
): Promise<OptionsCorrectorResult> {
  const start = options.startDate ? new Date(options.startDate) : null;
  const end = options.endDate ? new Date(options.endDate) : null;
  let query: Partial<ClientQuery> = {};

  if (options.search) {
    query.$or = [
      { title: { $regex: options.search, $options: "i" } },
      { subtitle: { $regex: options.search, $options: "i" } },
      // { content: { $regex: options.search, $options: "i" } },
    ];
  }

  if (options.status !== undefined) {
    console.log(options);
    query.isListed = options.status;
  }

  if (start || end) {
    query.createdAt = {};
    if (start) query.createdAt.$gte = start;
    if (end) query.createdAt.$lte = end;
  }

  const sort: { [key: string]: 1 | -1 } = {
    [options.sortColumn]: options.sortDirection === "asc" ? 1 : -1,
  };

  const skip = (options.page - 1) * options.pageSize;
  const limit = options.pageSize;

  return {
    query,
    sort,
    skip,
    limit,
  };
}



export async function paramToQueryCategory(
    options: SearchFilterSortParams
  ): Promise<OptionsCorrectorResult> {
    const start = options.startDate ? new Date(options.startDate) : null;
    const end = options.endDate ? new Date(options.endDate) : null;
    let query: Partial<ClientQuery> = {};

    if (options.search) {
        query.$or = [
            { name: { $regex: options.search, $options: "i" } },
            { name: { $regex: options.search, $options: "i" } },
        ];
    }

    if (options.status !== undefined) {
        query.isListed = options.status;
    }

    if (start || end) {
        query.createdAt = {};
        if (start) query.createdAt.$gte = start;
        if (end) query.createdAt.$lte = end;
    }

    const sort: { [key: string]: 1 | -1 } = {
        [options.sortColumn]: options.sortDirection === "asc" ? 1 : -1,
    };

    const skip = (options.page - 1) * options.pageSize;
    const limit = options.pageSize
    
  
    return {
      query,
      sort,
      skip,
      limit,
    };
  }
  
