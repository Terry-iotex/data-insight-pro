/**
 * 项目分组管理 Store
 * 项目是数据源的逻辑分组，每个数据源可属于一个项目
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Project {
  id: string
  name: string
  order: number  // 用于排序
  createdAt: number
}

interface ProjectContextType {
  projects: Project[]
  addProject: (name: string) => Project
  removeProject: (id: string) => void
  updateProject: (id: string, updates: Partial<Pick<Project, 'name' | 'order'>>) => void
  reorderProjects: (orderedIds: string[]) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

const PROJECTS_STORE_KEY = 'deciflow_projects'

const DEFAULT_PROJECT: Project = {
  id: 'default',
  name: '默认项目',
  order: 0,
  createdAt: 0,
}

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([DEFAULT_PROJECT])

  // 初始化：从 localStorage 加载
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROJECTS_STORE_KEY)
      if (saved) {
        const parsed: Project[] = JSON.parse(saved)
        // 确保始终包含默认项目
        const hasDefault = parsed.some(p => p.id === 'default')
        if (!hasDefault) {
          parsed.unshift(DEFAULT_PROJECT)
        }
        setProjects(parsed.sort((a, b) => a.order - b.order))
      }
    } catch (error) {
      console.error('加载项目配置失败:', error)
    }
  }, [])

  const saveProjects = (list: Project[]) => {
    localStorage.setItem(PROJECTS_STORE_KEY, JSON.stringify(list))
  }

  const addProject = (name: string): Project => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name,
      order: projects.length,
      createdAt: Date.now(),
    }
    setProjects(prev => {
      const updated = [...prev, newProject]
      saveProjects(updated)
      return updated
    })
    return newProject
  }

  const removeProject = (id: string) => {
    // 不允许删除默认项目
    if (id === 'default') return
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id)
      saveProjects(updated)
      return updated
    })
  }

  const updateProject = (id: string, updates: Partial<Pick<Project, 'name' | 'order'>>) => {
    setProjects(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p)
      saveProjects(updated)
      return updated
    })
  }

  const reorderProjects = (orderedIds: string[]) => {
    setProjects(prev => {
      const map = new Map(prev.map(p => [p.id, p]))
      const updated = orderedIds
        .map((id, index) => {
          const p = map.get(id)
          return p ? { ...p, order: index } : null
        })
        .filter(Boolean) as Project[]
      saveProjects(updated)
      return updated
    })
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        removeProject,
        updateProject,
        reorderProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export const useProjects = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjects must be used within ProjectProvider')
  }
  return context
}

export default ProjectProvider
