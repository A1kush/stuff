/**
 * SKILL TREE SYSTEM
 * Visual skill tree with nodes and unlocks
 * 
 * @version 1.0.0
 */

class SkillTree {
  constructor() {
    this.nodes = [];
    this.unlockedNodes = new Set();
    this.skillPoints = 0;
    this.loadFromStorage();
  }

  /**
   * Add node to tree
   */
  addNode(node) {
    this.nodes.push(node);
  }

  /**
   * Unlock node
   */
  unlockNode(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return false;

    // Check prerequisites
    if (node.prerequisites && !node.prerequisites.every(prereq => this.unlockedNodes.has(prereq))) {
      return false;
    }

    // Check skill points
    if (this.skillPoints < node.cost) {
      return false;
    }

    this.skillPoints -= node.cost;
    this.unlockedNodes.add(nodeId);
    this.saveToStorage();

    // Dispatch unlock event
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('skillNodeUnlocked', {
        detail: { node }
      }));
    }

    return true;
  }

  /**
   * Check if node is unlocked
   */
  isUnlocked(nodeId) {
    return this.unlockedNodes.has(nodeId);
  }

  /**
   * Add skill points
   */
  addSkillPoints(amount) {
    this.skillPoints += amount;
    this.saveToStorage();
  }

  /**
   * Get available skill points
   */
  getSkillPoints() {
    return this.skillPoints;
  }

  /**
   * Save to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem('skillTree', JSON.stringify({
        unlockedNodes: Array.from(this.unlockedNodes),
        skillPoints: this.skillPoints
      }));
    } catch (e) {
      console.warn('Failed to save skill tree:', e);
    }
  }

  /**
   * Load from localStorage
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('skillTree');
      if (saved) {
        const data = JSON.parse(saved);
        this.unlockedNodes = new Set(data.unlockedNodes || []);
        this.skillPoints = data.skillPoints || 0;
      }
    } catch (e) {
      console.warn('Failed to load skill tree:', e);
    }
  }
}

